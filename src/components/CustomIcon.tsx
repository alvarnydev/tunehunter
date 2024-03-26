import customIcons, {
  type CustomIconType,
  CustomIconVariant,
} from "@/helpers/custom-icons";
import { type FC } from "react";

interface CustomIconProps {
  icon: CustomIconType;
  height?: string;
  width?: string;
  variant?: CustomIconVariant;
}

const CustomIcon: FC<CustomIconProps> = ({
  icon,
  height = "20px",
  width = "20px",
  variant,
}) => {
  const classes = (() => {
    switch (variant) {
      case CustomIconVariant.primary:
        return "fill-primary-400";
      case CustomIconVariant.secondary:
        return "fill-secondary-400";
      case CustomIconVariant.tertiary:
        return "fill-tertiary-accent";
      case CustomIconVariant.lightTertiary:
        return "fill-tertiary-200";
      case CustomIconVariant.white:
        return "fill-white";
      case CustomIconVariant.stone:
        return "fill-greys-subtext";
      case CustomIconVariant.grey:
        return "fill-greys-text";
      default:
        return "";
    }
  })();
  return (
    <div className={classes} style={{ height, width }}>
      {customIcons[icon]}
    </div>
  );
};

export default CustomIcon;
