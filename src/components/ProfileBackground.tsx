import { cn } from "@/lib/utils";
import { type FC } from "react";

interface IProps {
  open: boolean;
}

const ProfileBackground: FC<IProps> = ({ open }) => {
  return (
    <div
      className={cn(
        "z-10 absolute bottom-8 left-1/2 transform -translate-x-1/2 rounded-full bg-gradient-to-b from-background to-primary h-6 w-6 backdrop-blur-md flex transition-all duration-700",
        open ? "scale-[150]" : "scale-0 invisible",
      )}
    />
  );
};
export default ProfileBackground;
