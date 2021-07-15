import { Slider, Rail, Tracks } from "react-compound-slider";
import { SliderRail, Track } from "./volume-components";

const domain = [-1, 0];

interface VolumeSliderProps {
  className?: string;
  gainNode?: GainNode;
  gain: number;
  setGain: Function;
  muted: boolean;
  setMuted: Function;
}

const VolumeSlider = (props: VolumeSliderProps) => {
  const changeGain = (values: readonly number[]) => {
    if (props.gainNode === undefined) return;

    const newGain = values[0];

    // Slider occasionally returns NaN based on how the mouse leaves
    if (isNaN(newGain)) return;

    // Show the mute icon if the gain is set to -100%
    if (newGain == -1) {
      props.setMuted(true);
    } else {
      if (props.muted) {
        props.setMuted(false);
      }
    }

    props.setGain(newGain);
    props.gainNode.gain.value = newGain;
  };

  return (
    <Slider
      step={0.01}
      domain={domain}
      values={[props.gain]}
      onChange={changeGain}
      onUpdate={changeGain}
      className={` relative ${props.className}`}
    >
      <Rail>
        {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
      </Rail>
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
  );
};

export default VolumeSlider;
