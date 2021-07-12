/*
 * Modified version of Misaki Nakano's visualizer CodePen (https://codepen.io/mnmxmx/pen/mmZbPK/)
 * for React and TypeScript, although not the most idiomatic code
 *
 * Copyright (c) 2017 Misaki Nakano
 * Licensed under MIT (https://opensource.org/licenses/MIT)
 */

import * as THREE from "three";
import * as THREEOrbitControls from "three/examples/jsm/controls/OrbitControls.js";
import { useEffect, useRef } from "react";
import { IUniform, ShaderMaterialParameters } from "three";

interface MousePosition {
  x: number;
  y: number;
  old_x: number;
  old_y: number;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

class Webgl {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  windowW: number;
  windowH: number;
  mouse: MousePosition;

  sphereG!: THREE.IcosahedronBufferGeometry;
  sphereM!: THREE.ShaderMaterial;
  vertex!: string;
  fragment!: string;
  mesh!: THREE.Mesh;

  sphereG_2!: THREE.IcosahedronBufferGeometry;
  sphereM_2!: THREE.ShaderMaterial;
  vertex_2!: string;
  fragment_2!: string;
  mesh_2!: THREE.Mesh;

  verticesArray!: ArrayLike<number>;
  vecCount!: number;
  indexCount!: number;
  vec3Array!: Vec3[];
  allVec3Array!: Vec3[];
  indexArray!: (number | boolean)[];
  indexPosArray!: number[][];
  frequencyNumArray!: number[];

  constructor(wrapper: HTMLDivElement) {
    this.scene = new THREE.Scene();
    const windowW = window.innerWidth;
    const windowH = Math.max(600, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(
      45,
      windowW / windowH,
      0.1,
      10000
    );
    this.camera.position.set(20, 200, -80);

    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.renderer.setPixelRatio(1.5);

    this.renderer.setClearColor(0x20c5d4, 0);
    this.renderer.setSize(windowW, windowH);

    wrapper.appendChild(this.renderer.domElement);
    wrapper.style.width = windowW + "px";
    wrapper.style.height = window.innerHeight + "px";

    this.renderer.domElement.style.width = windowW + "px";
    this.renderer.domElement.style.height = windowH + "px";

    const orbit = new THREEOrbitControls.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.windowW = windowW;
    this.windowH = window.innerHeight;

    this.mouse = {
      x: 0,
      y: 0,
      old_x: 0,
      old_y: 0,
    };

    //     document.addEventListener( 'mousemove', function(event){
    //       this.mouse.old_x = this.mouse.x;
    //       this.mouse.old_y = this.mouse.y;

    //       this.mouse.x = event.clientX - this.windowW / 2;
    //       this.mouse.y = event.clientY - this.windowH / 2;
    //     }.bind(this), false );

    window.onresize = () => {
      this.windowW = document.body.clientWidth;
      this.windowH = window.innerHeight;
      const _height = Math.max(600, this.windowH);
      this.renderer.setSize(this.windowW, _height);
      this.camera.aspect = this.windowW / _height;
      this.camera.updateProjectionMatrix();

      wrapper.style.width = this.windowW + "px";
      wrapper.style.height = window.innerHeight + "px";
    };

    this.createSphere();

    this.renderer.render(this.scene, this.camera);
  }

  createSphere() {
    this.createShader();

    this.sphereG = new THREE.IcosahedronBufferGeometry(40, 4);
    this.sphereM = new THREE.ShaderMaterial({
      vertexShader: this.vertex,
      fragmentShader: this.fragment,
      uniforms: {
        uTime: { type: "f", value: 0 } as IUniform,
        uScale: { type: "f", value: 0 } as IUniform,
        isBlack: { type: "i", value: 1 } as IUniform,
      },
      wireframe: true,
      transparent: true,
    });

    this.detectIndex();
    this.sphereG.addAttribute(
      "aFrequency",
      new THREE.BufferAttribute(new Float32Array(this.indexArray.length), 1)
    );

    this.mesh = new THREE.Mesh(this.sphereG, this.sphereM);

    this.scene.add(this.mesh);

    this.createSphere2();
  }

  createSphere2() {
    this.sphereG_2 = new THREE.IcosahedronBufferGeometry(39.5, 4);
    this.sphereG_2.addAttribute(
      "aFrequency",
      new THREE.BufferAttribute(new Float32Array(this.indexArray.length), 1)
    );
    this.sphereM_2 = new THREE.ShaderMaterial({
      vertexShader: this.vertex_2,
      fragmentShader: this.fragment_2,
      uniforms: {
        uScale: { type: "f", value: 0 } as IUniform,
        isBlack: { type: "i", value: 1 } as IUniform,
      },

      flatShading: true,
    } as ShaderMaterialParameters);

    this.mesh_2 = new THREE.Mesh(this.sphereG_2, this.sphereM_2);
    this.scene.add(this.mesh_2);
  }

  detectIndex() {
    this.verticesArray = this.sphereG.attributes.position.array;
    const arrayLength = this.verticesArray.length;

    this.vecCount = 0;
    this.indexCount = 0;
    this.vec3Array = [];
    this.allVec3Array = [];
    this.indexArray = [];
    this.indexPosArray = [];
    this.frequencyNumArray = [];

    for (let i = 0; i < arrayLength; i += 3) {
      const vec3: Vec3 = {
        x: this.verticesArray[i],
        y: this.verticesArray[i + 1],
        z: this.verticesArray[i + 2],
      };

      const detect = this.detectVec(vec3);
      this.allVec3Array.push(vec3);

      if (detect === 0 || detect > 0) {
        this.indexArray[this.indexCount] = detect;
        this.indexPosArray[detect as number].push(this.indexCount);
      } else {
        this.vec3Array[this.vecCount] = vec3;
        this.indexArray[this.indexCount] = this.vecCount;

        this.indexPosArray[this.vecCount] = [];
        this.indexPosArray[this.vecCount].push(this.indexCount);

        this.vecCount++;
      }

      this.indexCount++;
    }
  }

  detectVec(vec3: Vec3): number | boolean {
    if (this.vecCount === 0) return false;

    for (var i = 0, len = this.vec3Array.length; i < len; i++) {
      var _vec3 = this.vec3Array[i];
      var isExisted =
        vec3.x === _vec3.x && vec3.y === _vec3.y && vec3.z === _vec3.z;
      if (isExisted) {
        return i;
      }
    }

    return false;
  }

  createShader() {
    this.vertex = [
      "uniform float uTime;",
      "uniform float uScale;",

      "attribute float aFrequency;",
      "varying float vFrequency;",
      "varying float vPos;",

      "const float frequencyNum = 256.0;",
      "const float radius = 40.0;",
      "const float PI = 3.14159265;",
      "const float _sin15 = sin(PI / 10.0);",
      "const float _cos15 = cos(PI / 10.0);",

      "void main(){",

      "float frequency;",
      "float SquareF = aFrequency * aFrequency;",

      "frequency = smoothstep(16.0, 7200.0, SquareF) * SquareF / (frequencyNum * frequencyNum);",

      "vFrequency = frequency;",

      "float _uScale = (1.0 - uScale * 0.5 / frequencyNum) * 3.0;",

      "float _sin = sin(uTime * .5);",
      "float _cos = cos(uTime * .5);",

      "mat2 rot = mat2(_cos, -_sin, _sin, _cos);",
      "mat2 rot15 = mat2(_cos15, -_sin15, _sin15, _cos15);",

      "vec2 _pos = rot * position.xz;",
      "vec3 newPos = vec3(_pos.x, position.y, _pos.y);",
      "newPos.xy = rot15 * newPos.xy;",

      "newPos = (1.0 + uScale / (frequencyNum * 2.0) ) * newPos;",

      "vPos = (newPos.x + newPos.y + newPos.z) / (3.0 * 120.0);",

      "gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos + vFrequency * newPos * _uScale, 1.0);",
      "}",
    ].join("\n");

    this.fragment = [
      "uniform float uTime;",
      "uniform float uScale;",

      "uniform int isBlack;",

      "varying float vFrequency;",
      "varying float vPos;",

      "const float frequencyNum = 256.0;",
      "const vec3 baseColor = vec3(0.95, 0.25, 0.3);",
      // "const vec3 baseColor = vec3(0.0, 0.65, 0.7);",

      "void main(){",
      "float f = smoothstep(0.0, 0.00002, vFrequency * vFrequency) * vFrequency;",
      "float red = min(1.0, baseColor.r + f * 1.9);",
      "float green = min(1.0, baseColor.g + f * 3.6);",
      "float blue = min(1.0, baseColor.b + f* 0.01);",
      "float sum = red + blue + green;",

      "blue = min(1.0, blue + 0.3);",
      "green = max(0.0, green - 0.1);",

      "float offsetSum = (sum - (red + blue + green) / 3.0) / 3.0;",

      "blue += offsetSum + min(vPos * 2.0, -0.2);",
      "red += offsetSum + min(vPos * 0.5, 0.2);",
      "green += offsetSum - vPos * max(0.3, vFrequency * 2.0);",

      "vec3 color;",

      "color = vec3(red, green, blue);",

      "gl_FragColor = vec4(color, 1.0);",
      "}",
    ].join("\n");

    //color: 0xff6673,
    this.vertex_2 = [
      "varying vec3 vPosition;",

      "void main(){",
      "vPosition = position;",
      "gl_Position =projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "}",
    ].join("\n");
    this.fragment_2 = [
      "uniform float uScale;",
      "uniform int isBlack;",

      "varying vec3 vPosition;",
      "const float frequencyNum = 256.0;",

      "const float radius = 40.0;",
      "const vec3 baseColor = vec3(1.0, 102.0 / 255.0, 115.0 / 255.0);",
      // "const vec3 baseColor = vec3(0.1, 0.8, 0.9);",

      "void main(){",
      "vec3 pos = vec3(vPosition.x, -vPosition.y, vPosition.z) / (radius * 10.0) + 0.05;",

      "vec3 _color;",

      "_color = baseColor + pos;",

      // "float _uScale = uScale / (frequencyNum * 5.0);",

      "gl_FragColor = vec4(_color, 1.0);",
      "}",
    ].join("\n");
  }

  render() {
    this.sphereG.attributes.aFrequency.needsUpdate = true;
    // var d = this.mouse.x - this.mouse.old_x;
    // var theta = d * 0.1;
    // var sin = Math.sin(theta);
    // var cos = Math.cos(theta);

    // var x = this.camera.position.x;
    // var z = this.camera.position.z;

    // this.camera.position.x = x * cos - z * sin;
    //  this.camera.position.z = x * sin + z * cos;

    // this.camera.lookAt( this.scene.position );

    this.renderer.render(this.scene, this.camera);
  }
}

class Audio {
  webgl: Webgl;
  source?: AudioBufferSourceNode;
  audioContext: AudioContext;
  fileReader: FileReader;
  isReady: boolean;
  count: number;

  analyser!: AnalyserNode;
  gainNode!: GainNode;
  frequencyArray!: ArrayLike<number>;
  indexPosArray!: number[][];
  indexPosLength!: number;

  spectrums!: Uint8Array;

  constructor(_webgl: Webgl, file: HTMLInputElement) {
    this.webgl = _webgl;
    this.audioContext = new AudioContext();
    this.fileReader = new FileReader();
    this.init(file);
    this.isReady = false;
    this.count = 0;
    this.render();
  }

  init(file: HTMLInputElement) {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.minDecibels = -70;
    this.analyser.maxDecibels = 10;
    this.analyser.smoothingTimeConstant = 0.75;

    file.addEventListener("change", (e: Event) => {
      //if (e.target === null) return;
      let input = e.target as HTMLInputElement;
      let files = input?.files;

      if (files === null) return;

      this.fileReader.readAsArrayBuffer(files[0]);
    });

    this.fileReader.onload = () => {
      this.audioContext.decodeAudioData(
        this.fileReader.result as ArrayBuffer,
        (buffer) => {
          if (this.source) {
            this.source.stop();
          }
          this.source = this.audioContext.createBufferSource();
          this.source.buffer = buffer;

          this.source.loop = true;

          this.source.connect(this.analyser);

          this.gainNode = this.audioContext.createGain();

          this.source.connect(this.gainNode);
          this.gainNode.connect(this.audioContext.destination);
          this.source.start(0);

          this.frequencyArray = this.webgl.sphereG.attributes.aFrequency.array;
          this.indexPosArray = this.webgl.indexPosArray;
          this.indexPosLength = this.webgl.indexPosArray.length;
          this.isReady = true;
        }
      );
    };
  }

  _render() {
    if (!this.isReady) return;
    this.count++;

    this.spectrums = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(this.spectrums);

    var num,
      mult,
      frequency,
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

const Visualizer = () => {
  const wrapper = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wrapper.current === null || file.current === null) {
      return;
    }

    let webgl = new Webgl(wrapper.current);
    let audio = new Audio(webgl, file.current);
  });

  return (
    <div ref={wrapper} className="wrapper" id="wrapper">
      <label className="file" htmlFor="file">
        choose a mp3 file
        <input ref={file} id="file" type="file" />
      </label>
    </div>
  );
};

export default Visualizer;
