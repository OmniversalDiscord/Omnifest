import { useState, useRef, useEffect } from "react";
import Visualizer from "./components/visualizer";
import logo from "./logo.png";
import config from "./config/festival.json";
import Controls from "./components/controls";
import { PlayState } from "./components/controls/play-button";

const stream = new Audio();

function App() {
  const [playing, setPlaying] = useState(PlayState.Paused);
  const [muted, setMuted] = useState(false);
  const [gain, setGain] = useState(0);

  // Extend setGain to save the gain to the browser
  // so that volume setting can persist on reload
  const setAndSaveGain = (gainValue: number) => {
    localStorage.setItem("gain", `${gainValue}`);
    console.log(gainValue);
    setGain(gainValue);
  };

  // Load gain on start
  useEffect(() => {
    let gainValue = parseFloat(localStorage.getItem("gain") ?? "0");
    gainValue = isNaN(gainValue) ? 0 : gainValue;

    // If the volume bar was set to muted (not the icon)
    // set the icon to the muted icon
    if (gainValue == -1) {
      setMuted(true);
    }

    setGain(gainValue);
  }, []);

  // Needed as the gain node is created in the visualizer
  const [gainNode, setGainNode] = useState<GainNode>();

  return (
    <>
      <Visualizer getGainNode={setGainNode} audio={stream} />
      <div className="flex flex-row p-4 justify-between w-full z-20">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="flex flex-col order-last sm:order-first my-4 sm:my-0">
            <h1 className="font-mono opacity-50 text-xs">now playing</h1>
            <p className="font-mono text-lg font-bold">Rob Gasser</p>
          </div>
          <img
            src={logo}
            className="h-7 sm:absolute sm:mx-auto sm:left-0 sm:right-0"
            alt="Omniversal Logo"
          />
        </div>
        <Controls
          stream={stream}
          gainNode={gainNode}
          viewers={24}
          gain={gain}
          setGain={setAndSaveGain}
          muted={muted}
          setMuted={setMuted}
          playingState={playing}
          setPlayState={setPlaying}
        />
      </div>
    </>
  );
}

export default App;
