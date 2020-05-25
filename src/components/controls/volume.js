import React from 'react';
import PropTypes from 'prop-types';
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider';
import { SliderRail, Handle, Track } from './volume-components'; 

const sliderStyle = {
    position: 'absolute',
    height: '150px',
    touchAction: 'none',
    top: '40px',
    right: '51px'
}

const domain = [0, 1]

const Volume = ({onUpdate, value}) => {
    return (
        <Slider
            vertical
            mode={1}
            step={0.01}
            domain={domain}
            rootStyle={sliderStyle}
            values={[value]}
            onChange={onUpdate}
            onUpdate={onUpdate}
        >
            <Rail>
                {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
            </Rail>
            <Handles>
                {({ handles, getHandleProps }) => (
                    <div className="slider-handles">
                        {handles.map(handle => (
                            <Handle
                            key={handle.id}
                            handle={handle}
                            domain={domain}
                            getHandleProps={getHandleProps}
                        />
                    ))}
                    </div>
                )}
            </Handles>
            <Tracks right={false}>
                {({ tracks, getTrackProps }) => (
                    <div className="slider-tracks">
                        {tracks.map(({ id, source, target }) => (
                            <Track
                            key={id}
                            source={source}
                            target={target}
                            getTrackProps={getTrackProps}
                            />
                        ))}
                    </div>
                )}
            </Tracks>
        </Slider>
    )
}

Volume.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired
}

export default Volume