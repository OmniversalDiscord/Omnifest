import { useEffect, useRef } from "react";
import Analyzer from "./analyzer";
import Webgl from "./webgl";

interface VisualizerProps {
  getGainNode: Function;
  audio: HTMLAudioElement;
}

const Visualizer = (props: VisualizerProps) => {
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapper.current === null) {
      return;
    }

    let webgl = new Webgl(wrapper.current);
    let analyzer = new Analyzer(webgl, props.audio);
    props.getGainNode(analyzer.gainNode);
  }, []);

  return <div ref={wrapper} className="fixed -z-10" id="wrapper" />;
};

export default Visualizer;
