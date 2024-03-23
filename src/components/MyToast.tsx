import { type FC } from "react";
import { toast } from "sonner";

interface IProps {
  message: string;
}

const ClosableToast: FC<IProps> = ({ message }) => {
  return toast.custom((t) => (
    <div>
      {message} <button onClick={() => toast.dismiss(t)}>close</button>
    </div>
  ));
};

export default ClosableToast;
