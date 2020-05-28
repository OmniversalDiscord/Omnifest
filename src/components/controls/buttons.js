import React from "react"
import PropTypes from "prop-types"
import ReactLoading from "react-loading"
import { css, keyframes } from "@emotion/core"
import styled from "@emotion/styled"

import Volume from "./volume"

/*
    JSX button elements that can update based on playing, loading and muted states
*/

const IconButton = styled.button`
  all: unset;
  cursor: pointer !important;
  display: flex;
  align-items: center;
  z-index: 9999;

  & > i {
    font-size: 75px;
  }
`

const fadeIn = keyframes`
  0% {
    opacity: 0;
  } 
  100% {
    opacity: 1;
  }
`

// Additonal styles for the volume button to handle its behaviour
const volumeButtonStyles = css`
  margin-left: 16px;
  margin-right: 16px;

  :hover + div {
    opacity: 1;
    display: block;
    animation: ${fadeIn} 0.2s linear;
  }
`

const VolumeSlider = styled.div`
  opacity: 0;
  display: none;
  position: relative;

  :hover {
    opacity: 1;
    display: block;
  }
`

export const PlayButton = ({ playing, loaded, onPlayClick }) => {
  // Change the icon based on whether the stream is playing or stopped
  const icon = playing ? "pause_circle_filled" : "play_circle_filled"

  if (!loaded & playing) {
    // If we're trying to play but the stream isn't loaded, show an animation
    return <ReactLoading type={"bars"} height={75} width={75} />
  } else {
    // Otherwise just show the button
    return (
      <IconButton onClick={onPlayClick}>
        <i className="material-icons material-icons-round">{icon}</i>
      </IconButton>
    )
  }
}

PlayButton.propTypes = {
  playing: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  onPlayClick: PropTypes.func.isRequired,
}

export const VolumeButton = ({
  volume,
  muted,
  onVolumeChange,
  onMuteClick,
}) => {
  // Change the icon based on whether the stream is muted
  const icon = muted ? "volume_off" : "volume_up"

  const button = (
    <IconButton css={volumeButtonStyles} onClick={onMuteClick}>
      <i className="material-icons material-icons-round">{icon}</i>
    </IconButton>
  )

  // Add the volume slider to the button element
  return (
    <>
      {button}
      <VolumeSlider>
        <Volume onUpdate={onVolumeChange} value={volume} />
      </VolumeSlider>
    </>
  )
}

VolumeButton.propTypes = {
  volume: PropTypes.number.isRequired,
  muted: PropTypes.bool.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  onMuteClick: PropTypes.func.isRequired,
}
