import { useState, useRef, useEffect } from "react";
import { Container } from "tsparticles";
import Background from "./components/Background";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faVolumeUp,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import Visualizer from "./components/Visualizer";
import logo from "./logo.png";
import Hls from "hls.js";
import config from "./config/festival.json";

function App() {
  const [stream, _] = useState(new Audio());
  const [playing, setPlaying] = useState(false);

  const hls = new Hls();

  const attachHls = () => {
    if (Hls.isSupported()) {
      hls.loadSource(config.stream);
      hls.attachMedia(stream);
    } else {
      stream.src = config.stream;
    }

    stream.crossOrigin = "anonymous";
  };

  const togglePlayback = () => {
    if (playing) {
      stream.pause();
    } else {
      setPlaying(true);

      attachHls();
      stream.load();
      stream.play();
    }
  };

  stream.onpause = () => {
    setPlaying(false);
  };

  return (
    <>
      <Visualizer audio={stream} />
      <div className="flex flex-row p-4 justify-between w-full z-20">
        <div className="flex flex-col md:flex-row items-start">
          <div className="flex flex-col order-last sm:order-first my-4 sm:my-0">
            <h1 className="font-mono opacity-50 text-xs">now playing</h1>
            <p className="font-mono text-lg font-bold">shitewavzee</p>
          </div>
          <img
            src={logo}
            className="h-7 sm:absolute sm:mx-auto sm:left-0 sm:right-0"
          />
        </div>
        <div className="flex flex-row">
          <p className="font-mono text-xs mr-1">69</p>
          <FontAwesomeIcon className="mx-1" icon={faEye} />
          <FontAwesomeIcon
            className="mx-1 cursor-pointer hidden sm:inline"
            icon={faVolumeUp}
          />
          <FontAwesomeIcon
            className="cursor-pointer ml-1"
            icon={playing ? faPause : faPlay}
            onClick={togglePlayback}
          />
        </div>
      </div>
    </>
  );
}

export default App;
