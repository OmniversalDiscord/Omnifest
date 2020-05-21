import React, { useState, useEffect, useRef } from 'react';

import Layout from "../components/layout";
import SEO from "../components/seo";
import jsmediatags from 'jsmediatags';

const tagTest = (audio) => {
  jsmediatags.read(audio.src, {
    onSuccess: function(tag) {
      console.log(tag);
    },
    onError: function(error) {
      console.log(error);
    }
  });
}

const IndexPage = () => {
  const [name, setName] = useState("");
  const [artists, setArtists] = useState("");
  
  const stream = new Audio("http://audio.omniversal.co:8000/festival.mp3");
  stream.crossorigin = "anonymous";

  
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://audio.omniversal.co:8002');

    return () => {
      ws.current.close();
    }
  }, []);

  useEffect(() => {
    ws.current.onmessage = evt => {
      const data = JSON.parse(evt.data);
      setName(data.name);
      setArtists(data.artists);
    }
  });

  return (
    <Layout>
      <h1 style={{color: "white"}}>{name}</h1>
      <p style={{color: "white"}}>{artists}</p>
    </Layout>
  )
}

export default IndexPage
