import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import MuteButton from "./mute-button";
import PlayButton, { PlayState } from "./play-button";

interface ControlProps {
  stream: HTMLAudioElement;
  gainNode?: GainNode;
  viewers: number;
  gain: number;
  muted: boolean;
  setMuted: Function;
  playingState: PlayState;
  setPlayState: Function;
}

const Controls = (props: ControlProps) => {
  return (
    <div className="flex flex-row">
      <p className="font-mono text-xs mr-1">{props.viewers}</p>
      <FontAwesomeIcon className="mx-1" icon={faEye} />
      <MuteButton
        className="hidden sm:block mx-1"
        gainNode={props.gainNode}
        gain={props.gain}
        muted={props.muted}
        setMuted={props.setMuted}
      />
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
