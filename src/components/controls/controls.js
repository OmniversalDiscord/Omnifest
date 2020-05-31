import React from "react"
import PropTypes from "prop-types"
import styled from "@emotion/styled"

import { PlayButton, VolumeButton } from "./buttons"
/*
    Media controls for livestream playback
*/

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  z-index: 9999;
  margin-top: 16px;
  max-width: fit-content;
`

const InfoWrapper = styled.div`
  h1,
  p {
    margin: 0px;
    margin-top: -2px;
  }

  h1 {
    font-weight: 800;
    line-height: 40px;
  }

  p {
    opacity: 0.87;
  }
`

const Controls = ({
  name,
  artists,
  playing,
  muted,
  loaded,
  volume,
  onPlayClick,
  onMuteClick,
  onVolumeChange,
}) => {
  return (
    <ControlsWrapper>
      <PlayButton playing={playing} loaded={loaded} onPlayClick={onPlayClick} />
      <VolumeButton
        volume={volume}
        muted={muted}
        onVolumeChange={onVolumeChange}
        onMuteClick={onMuteClick}
      />

      <InfoWrapper>
        {/* If there's no B2B name, don't show it */}
        {name !== '' && <p>{name.toUpperCase()}</p>}
        <h1>{artists}</h1>
      </InfoWrapper>
    </ControlsWrapper>
  )
}

Controls.propTypes = {
  name: PropTypes.string.isRequired,
  artists: PropTypes.string.isRequired,
  playing: PropTypes.bool.isRequired,
  muted: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  volume: PropTypes.number.isRequired,
  onPlayClick: PropTypes.func.isRequired,
  onMuteClick: PropTypes.func.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
}

export default Controls
