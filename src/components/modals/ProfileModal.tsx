import { cn } from "@/lib/utils";
import { type FC } from "react";

interface IProps {
  open: boolean;
}

const ProfileModal: FC<IProps> = ({ open }) => {
  return (
    <div
      className={cn(
        "z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-300 flex justify-center items-center transition-all",
        open ? "visible" : "invisible",
      )}
    >
      Menu
    </div>
  );
};
export default ProfileModal;
