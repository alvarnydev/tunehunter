import { ScaleLoader } from "react-spinners";

export const MusicPlayingIndicator = ({ size }: { size: number }) => {
  return (
    <ScaleLoader
      height={size}
      width={size / 5}
      margin={size / 10}
      radius={size}
      speedMultiplier={0.8}
      color={"hsla(var(--in))"}
    />
  );
};
