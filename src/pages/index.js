import React, { useState, useEffect, useRef } from "react"
import { graphql } from "gatsby"
import AudioSpectrum from "react-audio-spectrum"

import Layout from "../components/layout/layout"
import Controls from "../components/controls/controls"

const IndexPage = ({ data }) => {
  const streamUrl = data.config.childSettingsJson.streamUrl
  const websocketUrl = data.config.childSettingsJson.websocketUrl

  // Basic state variables
  const [name, setName] = useState("")
  const [artists, setArtists] = useState("")
  const [playing, setPlaying] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [muted, setMuted] = useState(false)

  // Volume is simply kept in stream object in the application's running state
  // but we need this set so that volume can be set correctly when the app reloads
  const [loadedVolume, setLoadedVolume] = useState(0)

  // Stream is a state var as the visualizer needs to be reloaded when the stream is set
  const [stream, setStream] = useState(null)

  // UseRef so that the websocket can be set inside the effect
  const ws = useRef(null)

  // Only run once
  useEffect(() => {
    ws.current = new WebSocket(websocketUrl)

    // Stream has to be set here so that the site compiles
    // as GatsbyJS doesn't have an Audio function
    setStream(new Audio(streamUrl))

    return () => {
      ws.current.close()
    }
  }, [])

  // Run when stream is set from null to the URL
  // Effectively a run-once but with a predicate that stream isn't null
  useEffect(() => {
    // Don't do anything if the stream is null or else this will all fail
    if (stream != null) {
      // Load in the values
      loadVolume()
      loadMuted()

      // Start playing by default
      setPlaying(true)
      stream.play()

      // If the stream is trying to load, make sure it's set so the animation can load
      stream.addEventListener("loadstart", () => {
        setLoaded(false)
      })
      stream.addEventListener("loadeddata", () => {
        setLoaded(true)
      })
    }
  }, [stream])

  // If there's a new websocket message, update the site with the new data
  // so that the currently playing artist is in sync with the stream
  useEffect(() => {
    ws.current.onmessage = evt => {
      const data = JSON.parse(evt.data)
      setName(data.name)
      setArtists(data.artists)
    }
  })

  // Pause the stream (effectively stopping it)
  const pause = () => {
    setPlaying(false)
    stream.pause()

    // "Reset" the audio object so that the stream can resume from the live position
    // not the pause position
    stream.src = ""
    setTimeout(function () {
      stream.load() // Stop the stream downloading in the background
    })
  }

  // Load the stream back in and then play it
  const play = () => {
    setPlaying(true)
    setLoaded(false)

    // Set the stream back to the correct URL and start loading
    stream.src = streamUrl
    stream.load()
    stream.play()
  }

  const togglePlaying = () => {
    playing ? pause() : play()
  }

  const toggleMuted = () => {
    // Update the button state and the stream
    if (muted) {
      setMuted(false)
      stream.muted = false
    } else {
      setMuted(true)
      stream.muted = true
    }

    // Save the state to the browser to be loaded in again
    saveMuted()
  }

  const changeVolume = values => {
    // Slider returns an array, just get the first value
    const volume = values[0]

    // The slider can return NaN based on how the mouse leaves, so make sure nothing happens if it does
    if (!isNaN(volume)) {
      // Slider is upside down, so volume is actually 1 - volume
      stream.volume = 1 - volume

      // Mute if the volume is off ("1") so that the icon can update
      if (volume === 1) {
        setMuted(true)
      } else {
        // Unmute if the stream was muted so that the new volume can take effect
        setMuted(false)
        stream.muted = false
      }

      // Save the state to the browser to be loaded in again
      saveVolume()
    }
  }

  const loadVolume = () => {
    // Check if window is undefined so Gatsby doesn't fail
    if (typeof window !== "undefined") {
      if (localStorage.getItem("volume")) {
        // Parse the volume and set the slider and stream volume to the values
        // keeping in mind that volume is inverted for the slider
        const savedVolume = parseFloat(localStorage.getItem("volume"))
        setLoadedVolume(1 - savedVolume)
        stream.volume = savedVolume
      }
    }
  }

  const saveVolume = () => {
    // Check if window is undefined so Gatsby doesn't fail
    if (typeof window !== "undefined") {
      // Save the stream volume
      localStorage.setItem("volume", stream.volume)
    }
  }

  const loadMuted = () => {
    // Check if window is undefined so Gatsby doesn't fail
    if (typeof window !== "undefined") {
      if (localStorage.getItem("muted")) {
        // Convert the muted state to a boolean then update the site
        const savedMuted = localStorage.getItem("muted") === "true"
        setMuted(savedMuted)
        stream.muted = savedMuted
      }
    }
  }

  const saveMuted = () => {
    // Check if window is undefined so Gatsby doesn't fail
    if (typeof window !== "undefined") {
      localStorage.setItem("muted", stream.muted)
    }
  }

  // Needed to fix a bug where setting crossOrigin in useEffect didn't always work
  const streamWithCORS = () => {
    stream.crossOrigin = "anonymous"
    return stream
  }

  return (
    <Layout>
      {stream !== null && (
        <AudioSpectrum
          id="visualizer"
          height={200}
          width={1000}
          audioEle={streamWithCORS()}
          capHeight={2}
          capColor={"transparent"}
          meterWidth={6}
          meterCount={512}
          meterColor={data.config.childSettingsJson.foreground}
          gap={4}
        />
      )}
      <Controls
        className="controls"
        name={name}
        artists={artists}
        playing={playing}
        muted={muted}
        loaded={loaded}
        volume={loadedVolume}
        onPlayClick={togglePlaying}
        onMuteClick={toggleMuted}
        onVolumeChange={changeVolume}
      />
    </Layout>
  )
}

export const query = graphql`
  query IndexQuery {
    config: file(relativePath: { eq: "config.json" }) {
      childSettingsJson {
        streamUrl
        websocketUrl
        foreground
      }
    }
  }
`

export default IndexPage
