import { cn } from "@/lib/utils";
import { type FC } from "react";

interface IProps {
  open: boolean;
  enableAnimation?: boolean;
}

const ProfileBackground: FC<IProps> = ({ open, enableAnimation = true }) => {
  return (
    <div
      className={cn(
        "absolute bottom-8 left-1/2 z-40 flex h-6 w-6 -translate-x-1/2 transform cursor-default rounded-full bg-gradient-to-t from-primary from-50% to-background",
        enableAnimation && "menu-transition",
        open ? "scale-[250]" : "scale-0",
      )}
    >
      <div className="absolute inset-0 rounded-full backdrop-blur-md" />
    </div>
  );
};
export default ProfileBackground;
