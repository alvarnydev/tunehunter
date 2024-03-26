import customIcons, {
  type CustomIconType,
  CustomIconVariant,
} from "@/helpers/custom-icons";
import { cn } from "@/lib/utils";
import { type FC } from "react";

interface CustomIconProps {
  icon: CustomIconType;
  height?: string;
  width?: string;
  variant?: CustomIconVariant;
  className?: string;
}

const CustomIcon: FC<CustomIconProps> = ({
  icon,
  height = "20px",
  width = "20px",
  variant,
  className,
}) => {
  const classes = (() => {
    switch (variant) {
      case CustomIconVariant.foreground:
        return "fill-foreground group-hover:fill-accent-foreground";
      case CustomIconVariant.primary:
        return "fill-primary group-hover:fill-accent-foreground";
      case CustomIconVariant.secondary:
        return "fill-secondary";
      case CustomIconVariant.accent:
        return "fill-accent";
      case CustomIconVariant.destructive:
        return "fill-destructive";
      case CustomIconVariant.info:
        return "fill-info";
      case CustomIconVariant.warn:
        return "fill-warn";
      case CustomIconVariant.success:
        return "fill-success";
      case CustomIconVariant.muted:
        return "fill-muted";
      default:
        return "";
    }
  })();
  return (
    <div
      className={cn("transition-colors", classes, className)}
      style={{ height, width }}
    >
      {customIcons[icon]}
    </div>
  );
};

export default CustomIcon;
