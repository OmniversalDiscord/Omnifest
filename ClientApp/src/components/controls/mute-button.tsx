import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

interface MuteButtonProps {
  className?: string;
  gainNode?: GainNode;
  gain: number;
  muted: boolean;
  setMuted: Function;
}

const MuteButton = (props: MuteButtonProps) => {
  const toggleMute = () => {
    if (props.gainNode === undefined) return;

    // Gain is additive
    props.gainNode.gain.value = props.muted ? props.gain : -1;

    props.setMuted(!props.muted);
  };

  return (
    <FontAwesomeIcon
      className={`cursor-pointer ${props.className}`}
      icon={props.muted ? faVolumeMute : faVolumeUp}
      onClick={toggleMute}
    />
  );
};

export default MuteButton;
