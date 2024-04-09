import { type FC } from "react";
import { ScaleLoader } from "react-spinners";

interface IProps {
  size: number;
}

const LoadingIndicator: FC<IProps> = ({ size }) => {
  return (
    <ScaleLoader
      height={size}
      width={size / 5}
      margin={size / 10}
      radius={size}
      speedMultiplier={1}
      color={"hsl(var(--foreground))"}
    />
  );
};

export default LoadingIndicator;
