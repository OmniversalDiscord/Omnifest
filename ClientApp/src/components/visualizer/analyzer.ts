import Webgl from "./webgl";

class Analyzer {
  webgl: Webgl;
  audioElement: HTMLAudioElement;
  audioContext: AudioContext;
  isReady: boolean;
  count: number;

  analyser!: AnalyserNode;
  gainNode!: GainNode;
  frequencyArray!: ArrayLike<number>;
  indexPosArray!: number[][];
  indexPosLength!: number;

  spectrums!: Uint8Array;

  constructor(_webgl: Webgl, audio: HTMLAudioElement) {
    this.webgl = _webgl;
    this.audioElement = audio;
    // @ts-ignore
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.isReady = false;
    this.count = 0;
    this.init();
    this.render();
  }

  init() {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.minDecibels = -70;
    this.analyser.maxDecibels = 10;
    this.analyser.smoothingTimeConstant = 0.75;
    let source = this.audioContext.createMediaElementSource(this.audioElement);
    source.connect(this.analyser);
    source.connect(this.audioContext.destination);
    this.gainNode = this.audioContext.createGain();

    source.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = 0;

    this.frequencyArray = this.webgl.sphereG.attributes.aFrequency.array;
    this.indexPosArray = this.webgl.indexPosArray;
    this.indexPosLength = this.webgl.indexPosArray.length;
    this.isReady = true;
  }

  _render() {
    if (this.audioElement.paused) return;
    this.count++;

    this.spectrums = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(this.spectrums);

    var num,
      mult,
      maxNum = 255,
      frequencyAvg = 0;

    for (var i = 0; i < this.indexPosLength; i++) {
      mult = Math.floor(i / maxNum);

      if (mult % 2 === 0) {
        num = i - maxNum * mult;
      } else {
        num = maxNum - (i - maxNum * mult);
      }

      var spectrum = num > 150 ? 0 : this.spectrums[num + 20];
      frequencyAvg += spectrum * 1.2;

      var indexPos = this.indexPosArray[i];
      spectrum = Math.max(0, spectrum - i / 80);

      for (var j = 0, len = indexPos.length; j < len; j++) {
        var vectorNum = indexPos[j];
        // @ts-ignore
        this.frequencyArray[vectorNum] = spectrum;
      }
    }

    frequencyAvg /= this.indexPosLength;
    frequencyAvg *= 1.7;
    this.webgl.sphereM.uniforms["uScale"].value = this.webgl.sphereM_2.uniforms[
      "uScale"
    ].value = frequencyAvg * 1.7;
    this.webgl.sphereM.uniforms["uTime"].value += 0.015;

    this.webgl.mesh_2.scale.x = 1 + frequencyAvg / 290;
    this.webgl.mesh_2.scale.y = 1 + frequencyAvg / 290;
    this.webgl.mesh_2.scale.z = 1 + frequencyAvg / 290;
  }

  render() {
    this._render();
    this.webgl.render();
    requestAnimationFrame(this.render.bind(this));
  }
}

export default Analyzer;