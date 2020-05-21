import React from "react"
import PropTypes from "prop-types"
import ReactLoading from 'react-loading';

import controlStyles from "./controls.module.css"

const Controls = ({ className, name, artists, playing, loaded, onPlayClick }) => {
    var button;

    if (playing && loaded) {
        button = <button onClick={onPlayClick}><i className="material-icons material-icons-round">pause_circle_filled</i></button>;
    } else if (playing && !loaded) {
        button = <ReactLoading type={"bars"} height={75} width={75} />
    } else { 
        button = <button onClick={onPlayClick}><i className="material-icons material-icons-round">play_circle_filled</i></button>
    }

    return (
      <div className={`${className} ${controlStyles.controls}`}>
        {button}
        <div>
            <h1 style={{color: "white"}}>{name}</h1>
            <p style={{color: "white"}}>{artists}</p>
        </div>
      </div>
    )
}

Controls.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    artists: PropTypes.string.isRequired,
    playing: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    onPlayClick: PropTypes.func.isRequired
};

export default Controls
