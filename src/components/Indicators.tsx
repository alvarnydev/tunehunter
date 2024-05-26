import { MoonLoader, ScaleLoader } from "react-spinners";

export const MusicPlayingIndicator = ({ size }: { size: number }) => {
  return (
    <ScaleLoader
      height={size}
      width={size / 5}
      margin={size / 10}
      radius={size}
      speedMultiplier={0.8}
      color={"hsl(var(--primary))"}
    />
  );
};

export const LoadingIndicator = ({ size }: { size: number }) => {
  return <MoonLoader color={"hsl(var(--primary))"} className="m-auto" />;
};
