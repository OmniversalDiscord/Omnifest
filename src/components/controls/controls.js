import React from 'react'
import PropTypes from 'prop-types'
import ReactLoading from 'react-loading';

import Volume from './volume';
import controlStyles from './controls.module.css';
import './controls.css';

/*
    Media controls for livestream playback
*/

// Define JSX button elements that can update based on playing, loading and muted states
const PlayButton = ({ playing, loaded, onPlayClick }) => {
    // Change the icon based on whether the stream is playing or stopped
    const icon = playing ? 'pause_circle_filled' : 'play_circle_filled';

    if (!loaded & playing) {
        // If we're trying to play but the stream isn't loaded, show an animation
        return <ReactLoading type={'bars'} height={75} width={75} />;
    } else {
        // Otherwise just show the button
        return <button className={controlStyles.iconButton} onClick={onPlayClick}><i className='material-icons material-icons-round'>{icon}</i></button>;
    }
}

PlayButton.propTypes = {
    playing: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    onPlayClick: PropTypes.func.isRequired
}

const VolumeButton = ({ muted, onMuteClick }) => {
    // Change the icon based on whether the stream is muted
    const icon = muted ? 'volume_off' : 'volume_up'

    return <button className={`volume-button ${controlStyles.iconButton}`} onClick={onMuteClick}><i className='material-icons material-icons-round'>{icon}</i></button>;
}

VolumeButton.propTypes = {
    muted: PropTypes.bool.isRequired,
    onMuteClick: PropTypes.func.isRequired
}

const Controls = ({ className, name, artists, playing, muted, loaded, volume, onPlayClick, onMuteClick, onVolumeChange }) => {
    return (
        <div>
            <div className={`${className} ${controlStyles.controls}`}>
                <PlayButton playing={playing} loaded={loaded} onPlayClick={onPlayClick} />
                <VolumeButton muted={muted} onMuteClick={onMuteClick} />
                <div className='volume-wrapper'>
                    <Volume onUpdate={onVolumeChange} value={volume} />
                </div>
                <div>
                    {/* If there's no B2B name, don't show it */}
                    {name !== null &&
                        <p>{name.toUpperCase()}</p>
                    }
                    <h1>{artists}</h1>
                </div>
            </div>
      </div>
    )
}

Controls.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    artists: PropTypes.string.isRequired,
    playing: PropTypes.bool.isRequired,
    muted: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    volume: PropTypes.number.isRequired,
    onPlayClick: PropTypes.func.isRequired,
    onMuteClick: PropTypes.func.isRequired,
    onVolumeChange: PropTypes.func.isRequired
};

export default Controls
