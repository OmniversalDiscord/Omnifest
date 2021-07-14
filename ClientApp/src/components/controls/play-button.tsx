import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { ScaleLoader } from "react-spinners";
import Hls from "hls.js";
import config from "../../config/festival.json";

export enum PlayState {
  Playing,
  Paused,
  Loading,
}

interface PlayButtonProps {
  className?: string;
  stream: HTMLAudioElement;
  setPlayState: Function;
  state: PlayState;
}

const hls = new Hls();

const PlayButton = (props: PlayButtonProps) => {
  // Attach HLS.js to the Audio element
  const attachHls = () => {
    if (Hls.isSupported()) {
      hls.loadSource(config.stream);
      hls.attachMedia(props.stream);
    } else {
      props.stream.src = config.stream;
    }

    props.stream.crossOrigin = "anonymous";
  };

  // Reload the stream on play to keep the stream in sync
  const togglePlayback = () => {
    if (props.state != PlayState.Paused) {
      props.stream.pause();
    } else {
      attachHls();
      props.stream.load();
      props.stream.play();
    }
  };

  // Various event listeners
  props.stream.addEventListener("pause", () => {
    props.setPlayState(PlayState.Paused);
  });

  props.stream.addEventListener("loadstart", () => {
    props.setPlayState(PlayState.Loading);
  });

  props.stream.addEventListener("waiting", () => {
    props.setPlayState(PlayState.Loading);
  });

  props.stream.addEventListener("stalled", () => {
    props.setPlayState(PlayState.Loading);
  });

  props.stream.addEventListener("playing", () => {
    props.setPlayState(PlayState.Playing);
  });

  // If loading, return a loading icon,
  // otherwise return a play/pause icon
  if (props.state == PlayState.Loading) {
    return (
      <ScaleLoader
        css="margin-left: 0.25rem"
        color="#fff"
        height={15}
        width={3}
        radius={10}
        margin={1}
      />
    );
  } else {
    return (
      <FontAwesomeIcon
        className={`cursor-pointer ${props.className}`}
        icon={props.state == PlayState.Playing ? faPause : faPlay}
        onClick={togglePlayback}
      />
    );
  }
};

export default PlayButton;
