import { cn } from "@/lib/utils";
import { type FC } from "react";

interface IProps {
  open: boolean;
}

const ProfileBackground: FC<IProps> = ({ open }) => {
  return (
    <div
      className={cn(
        "z-10 absolute bottom-8 left-1/2 transform -translate-x-1/2 rounded-full bg-gradient-to-t from-primary from-50% to-background h-6 w-6 flex menu-transition",
        open ? "scale-[150]" : "scale-0",
      )}
    >
      <div className="absolute inset-0 backdrop-blur-mdrounded-full"></div>
    </div>
  );
};
export default ProfileBackground;
