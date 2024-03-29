import { useEffect, useRef, useState } from "react";
import Analyzer from "./analyzer";
import Webgl from "./webgl";

interface VisualizerProps {
  getGainNode: Function;
  audio: HTMLAudioElement;
  start: boolean;
  enabled: boolean;
}

const Visualizer = (props: VisualizerProps) => {
  const webgl = useRef<Webgl>();
  const analyzer = useRef<Analyzer>();
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapper.current === null) {
      return;
    }

    webgl.current = new Webgl(wrapper.current);
    analyzer.current = new Analyzer(webgl.current, props.audio);
    props.getGainNode(analyzer.current?.gainNode);
  }, []);

  // This is hacky but it's the day before the festival so idc
  if (props.start) {
    analyzer.current?.audioContext.resume();
  } else {
    analyzer.current?.audioContext.suspend();
  }

  if (analyzer.current?.requestId === undefined && props.enabled) {
    analyzer.current?.startRender();
  } else if (analyzer.current?.requestId != undefined && !props.enabled) {
    analyzer.current?.pauseRender();
  }

  return <div ref={wrapper} className="fixed -z-10" id="wrapper" />;
};

export default Visualizer;
