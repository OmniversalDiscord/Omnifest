import React, { useState, useEffect, useRef } from 'react';
import AudioSpectrum from 'react-audio-spectrum';

import Layout from "../components/layout";
import Controls from "../components/controls";
import SEO from "../components/seo";

const IndexPage = () => {
  const [name, setName] = useState("");
  const [artists, setArtists] = useState("");
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [stream, setStream] = useState(null);

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://audio.omniversal.co:8002');
    setStream(new Audio("http://audio.omniversal.co:8000/festival.mp3"));
    
    return () => {
      ws.current.close();
    }
  }, []);

  useEffect(() => {
    if (stream != null) {
      stream.crossOrigin = "anonymous";
      setPlaying(true);
      stream.play();

      stream.addEventListener('loadstart', () => { setLoaded(false) });
      stream.addEventListener('loadeddata', () => { setLoaded(true) });
    }
  }, [stream]);

  useEffect(() => {
    ws.current.onmessage = evt => {
      const data = JSON.parse(evt.data);
      setName(data.name);
      setArtists(data.artists);
    }
  });

  const togglePlaying = () => {
    if (playing) {
      console.log("hi");
      setPlaying(false);
      stream.pause();
    } else {
      setPlaying(true);
      stream.play();
    }
  }

  return (
    <Layout>
      {stream !== null &&
        <AudioSpectrum
          id="visualizer"
          height={200}
          width={1000}
          audioEle={stream}
          capHeight={2}
          capColor={'transparent'}
          meterWidth={6}
          meterCount={512}
          meterColor={"white"}
          gap={4}
        />
      }
      <Controls className="controls" name={name} artists={artists} playing={playing} loaded={loaded} onPlayClick={togglePlaying}></Controls>
    </Layout>
  )
}

export default IndexPage
