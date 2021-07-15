import { useState, useRef, useEffect } from "react";
import Visualizer from "./components/visualizer";
import logo from "./logo.png";
import config from "./config/festival.json";
import Controls from "./components/controls";
import { PlayState } from "./components/controls/play-button";
import { Helmet, HelmetProvider } from "react-helmet-async";
import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";

const stream = new Audio();

function App() {
  const connection = useRef<HubConnection | null>(null);

  const [viewers, setViewers] = useState<number>();
  const [artist, setArtist] = useState("");

  const [playing, setPlaying] = useState(PlayState.Paused);
  const [muted, setMuted] = useState(false);
  const [gain, setGain] = useState(0);

  // Needed as the gain node is created in the visualizer
  const [gainNode, setGainNode] = useState<GainNode>();

  // Extend setGain to save the gain to the browser
  // so that volume setting can persist on reload
  const setAndSaveGain = (gainValue: number) => {
    localStorage.setItem("gain", `${gainValue}`);
    setGain(gainValue);
  };

  // Load gain on start
  useEffect(() => {
    if (gainNode === undefined) return;

    let gainValue = parseFloat(localStorage.getItem("gain") ?? "0");
    gainValue = isNaN(gainValue) ? 0 : gainValue;

    // If the volume bar was set to muted (not the icon)
    // set the icon to the muted icon
    if (gainValue == -1) {
      setMuted(true);
    }

    setGain(gainValue);
    gainNode.gain.value = gainValue;
  }, [gainNode]); // Gain node is a dependency to ensure that it's properly set

  // Set up SignalR connection
  useEffect(() => {
    connection.current = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/streamHub")
      .build();

    connection.current?.start();
  }, []);

  // SignalR methods
  connection.current?.on("updateViewCount", (viewers: number) => {
    setViewers(viewers);
  });

  connection.current?.on("updateArtist", (artist: string) => {
    setArtist(artist);
  });

  return (
    <HelmetProvider>
      <Helmet>
        <title>{config.title}</title>
      </Helmet>
      <Visualizer
        start={playing != PlayState.Paused}
        getGainNode={setGainNode}
        audio={stream}
      />
      <div className="flex flex-row p-4 justify-between w-full z-20 fixed">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="flex flex-col order-last sm:order-first my-4 sm:my-0">
            <h1 className="font-mono opacity-50 text-xs">now playing</h1>
            <p className="font-mono text-lg font-bold">{artist}</p>
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
          viewers={viewers}
          gain={gain}
          setGain={setAndSaveGain}
          muted={muted}
          setMuted={setMuted}
          playingState={playing}
          setPlayState={setPlaying}
        />
      </div>
    </HelmetProvider>
  );
}

export default App;
