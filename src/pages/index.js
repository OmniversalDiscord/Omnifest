import React, { useState, useEffect, useRef } from 'react';
import AudioSpectrum from 'react-audio-spectrum';

import Layout from "../components/layout";
import Controls from "../components/controls/controls";
import Volume from "../components/controls/volume";
import SEO from "../components/seo";

const IndexPage = () => {
  const streamUrl = "http://audio.omniversal.co:8000/festival.mp3"

  const [name, setName] = useState("");
  const [artists, setArtists] = useState("");
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [stream, setStream] = useState(null);
  const [volume, setVolume] = useState(1);

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://audio.omniversal.co:8002');
    setStream(new Audio(streamUrl));
    
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

  const pause = () => {
    setPlaying(false);
    stream.pause();
    stream.src = "";
    setTimeout(function () { 
      stream.load(); // This stops the stream from downloading
    });
  }

  const play = () => {
    setPlaying(true);
    setLoaded(false);
    stream.src = streamUrl;
    stream.load();
    stream.play();
  }

  const togglePlaying = () => {
    if (playing) {
      pause();
    } else {
      play();
    }
  }

  const toggleMuted = () => {
    if (muted) {
      setMuted(false);
      stream.volume = volume;
    } else {
      setMuted(true);
      stream.volume = 0;
    }
  }

  const changeVolume = newVolume => {
    if (!isNaN(newVolume)) {
      setVolume(1 - newVolume);
      stream.volume = volume;
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
      <Controls 
        className="controls" 
        name={name} 
        artists={artists}
        playing={playing}
        muted={muted}
        loaded={loaded} 
        onPlayClick={togglePlaying} 
        onMuteClick={toggleMuted}
        onVolumeChange={changeVolume}
      />
    </Layout>
  )
}

export default IndexPage
