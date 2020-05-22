import React from "react"
import PropTypes from "prop-types"
import ReactLoading from 'react-loading';

import Volume from './volume';
import controlStyles from "./controls.module.css";
import './controls.css';

const Controls = ({ className, name, artists, playing, muted, loaded, onPlayClick, onMuteClick, onVolumeChange }) => {
    var play_button;
    var volume_button;

    if (playing && loaded) {
        play_button = <button className={controlStyles.iconButton} onClick={onPlayClick}><i className="material-icons material-icons-round">pause_circle_filled</i></button>;
    } else if (playing && !loaded) {
        play_button = <ReactLoading type={"bars"} height={75} width={75} />
    } else { 
        play_button = <button className={controlStyles.iconButton} onClick={onPlayClick}><i className="material-icons material-icons-round">play_circle_filled</i></button>
    }

    if (muted) {
        volume_button = <button className={`volume-button ${controlStyles.iconButton}`} onClick={onMuteClick}><i className="material-icons material-icons-round">volume_off</i></button>
    } else {
        volume_button = <button className={`volume-button ${controlStyles.iconButton}`} onClick={onMuteClick}><i className="material-icons material-icons-round">volume_up</i></button>
    }

    return (
        <div>
            <div className={`${className} ${controlStyles.controls}`}>
                {play_button}
                {volume_button}
                <div className="volume-wrapper">
                    <Volume onUpdate={onVolumeChange}></Volume>
                </div>
                <div>
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
    onPlayClick: PropTypes.func.isRequired,
    onMuteClick: PropTypes.func.isRequired,
    onVolumeChange: PropTypes.func.isRequired
};

export default Controls
