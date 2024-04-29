import customIcons, { type CustomIconType, type CustomIconVariant } from "@/helpers/custom-icons";
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
      case "background":
        return "fill-background";
      case "foreground":
        return "fill-foreground";
      case "primary":
        return "fill-primary";
      case "primary-foreground":
        return "fill-primary-foreground";
      case "accent":
        return "fill-accent";
      case "accent-foreground":
        return "fill-accent-foreground";
      case "secondary":
        return "fill-secondary";
      case "secondary-foreground":
        return "fill-secondary-foreground";
      case "destructive":
        return "fill-destructive";
      case "destructive-foreground":
        return "fill-destructive-foreground";
      case "info":
        return "fill-info";
      case "info-foreground":
        return "fill-info-foreground";
      case "warn":
        return "fill-warn";
      case "warn-foreground":
        return "fill-warn-foreground";
      case "success":
        return "fill-success";
      case "success-foreground":
        return "fill-success-foreground";
      case "muted":
        return "fill-muted";
      case "muted-foreground":
        return "fill-muted-foreground";
      case "card":
        return "fill-card";
      case "card-foreground":
        return "fill-card-foreground";
      case "popover":
        return "fill-popover";
      case "popover-foreground":
        return "fill-popover-foreground";
      case "border":
        return "fill-border";
      case "input":
        return "fill-input";
      case "ring":
        return "fill-ring";
      default:
        return "";
    }
  })();
  return (
    <div className={cn("transition-colors", classes, className)} style={{ height, width }}>
      {customIcons[icon]}
    </div>
  );
};

export default CustomIcon;
