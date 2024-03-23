import { type FC } from "react";
import { SyncLoader } from "react-spinners";

interface IProps {
  size: number;
}

const LoadingIndicator: FC<IProps> = ({ size }) => {
  return (
    <SyncLoader
      size={size / 3}
      margin={size / 10}
      color={"hsla(var(--bc))"}
      speedMultiplier={0.7}
      className="m-auto"
    />
  );
};

export default LoadingIndicator;
