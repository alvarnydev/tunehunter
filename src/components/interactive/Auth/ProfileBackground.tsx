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
        "absolute bottom-8 left-1/2 z-40 flex h-6 w-6 -translate-x-1/2 transform rounded-full bg-gradient-to-t from-primary from-50% to-background",
        enableAnimation && "menu-transition",
        open ? "scale-[250]" : "scale-0",
      )}
    >
      <div className="backdrop-blur-mdrounded-full absolute inset-0" />
    </div>
  );
};
export default ProfileBackground;
