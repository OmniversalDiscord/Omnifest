import { SliderItem, GetTrackProps, GetRailProps } from "react-compound-slider";

interface SliderRailProps {
  getRailProps: GetRailProps;
}

export const SliderRail = (props: SliderRailProps) => (
  <>
    <div
      className="absolute w-full rounded-lg h-2 bg-white opacity-30 cursor-pointer"
      style={{
        transform: "translate(0%, -50%)",
      }}
      {...props.getRailProps()}
    />
  </>
);

interface TrackProps {
  source: SliderItem;
  target: SliderItem;
  getTrackProps: GetTrackProps;
  disabled?: boolean;
}

export const Track: React.FC<TrackProps> = ({
  source,
  target,
  getTrackProps,
}) => {
  return (
    <div
      className="absolute w-full rounded-lg h-2 bg-white cursor-pointer"
      style={{
        transform: "translate(0%, -50%)",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  );
};
