import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import VolumeSlider from "./volume-slider";
import MuteButton from "./mute-button";
import PlayButton, { PlayState } from "./play-button";

interface ControlProps {
  stream: HTMLAudioElement;
  gainNode?: GainNode;
  viewers: number;
  gain: number;
  setGain: Function;
  muted: boolean;
  setMuted: Function;
  playingState: PlayState;
  setPlayState: Function;
}

const Controls = (props: ControlProps) => {
  return (
    <div className="flex flex-row items-center h-0 my-2">
      <p className="font-mono text-xs mr-1">{props.viewers}</p>
      <FontAwesomeIcon className="mx-1" icon={faEye} />
      <div className="group flex flex-row items-center">
        <VolumeSlider
          className="hidden sm:block transition-width duration-20 ease-in-out group-hover:w-14 md:group-hover:w-24 w-0 group-hover:mx-1"
          gainNode={props.gainNode}
          gain={props.muted ? -1 : props.gain}
          setGain={props.setGain}
          muted={props.muted}
          setMuted={props.setMuted}
        />
        <MuteButton
          className="mx-1"
          // Add extra margin for the mute icon
          style={props.muted ? { marginLeft: "5px", marginRight: "5px" } : {}}
          gainNode={props.gainNode}
          gain={props.gain}
          muted={props.muted}
          setMuted={props.setMuted}
        />
      </div>
      <PlayButton
        className="ml-1"
        stream={props.stream}
        state={props.playingState}
        setPlayState={props.setPlayState}
      />
    </div>
  );
};

export default Controls;
