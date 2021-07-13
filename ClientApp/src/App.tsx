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

function App() {
  // const particles = useRef<Container>(null);
  // const [particlesEnabled, setParticlesEnabled] = useState(true);

  // const toggleParticles = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setParticlesEnabled(event.target.checked);
  //   if (particlesEnabled) {
  //     particles.current?.pause();
  //   } else {
  //     particles.current?.play();
  //   }
  // };

  return (
    <>
      {/* <Background ref={particles} /> */}
      <Visualizer />
      <div className="flex flex-row p-4 justify-between w-full">
        <div className="flex flex-col flex-grow">
          <h1 className="font-mono opacity-50 text-xs">now playing</h1>
          <p className="font-mono text-lg font-bold">shitewavzee</p>
        </div>
        {/* <div>
          <label
            className="text-white m-4 font-mono opacity-50 text-xs"
            htmlFor="particlesToggle"
          >
            particle motion (for slower cpus)
          </label>
          <input
            type="checkbox"
            id="particlesToggle"
            checked={particlesEnabled}
            onChange={toggleParticles}
          />
        </div> */}
        <img src={logo} className="h-7 absolute mx-auto left-0 right-0" />
        <div className="flex flex-row">
          <p className="font-mono text-xs mx-2">69</p>
          <FontAwesomeIcon icon={faEye} />
          <FontAwesomeIcon className="mx-2" icon={faVolumeUp} />
          <FontAwesomeIcon icon={faPause} />
        </div>
      </div>
    </>
  );
}

export default App;
