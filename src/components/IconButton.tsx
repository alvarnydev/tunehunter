import { type CustomIconType, type CustomIconVariant } from "@/helpers/custom-icons";
import { type ButtonHTMLAttributes, type FC } from "react";
import CustomIcon from "./CustomIcon";
import {
  Button,
  CustomButtonBorderedVariant,
  type CustomButtonSizeVariant,
  type CustomButtonVariant,
} from "./ui/button";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  bordered?: CustomButtonBorderedVariant;
  icon?: CustomIconType;
  iconPosition?: "left" | "right";
  text?: string;
  variant?: CustomButtonVariant;
  size?: CustomButtonSizeVariant;
}

const buttonToIconVariantMap: Record<CustomButtonVariant, CustomIconVariant> = {
  default: "foreground",
  primary: "primary-foreground",
  secondary: "secondary-foreground",
  accent: "accent-foreground",
  destructive: "destructive-foreground",
  success: "success-foreground",

  link: "link-foreground",
  ghost: "ghost-foreground",
  ghostReduced: "ghost-foreground",
  ghostDestructive: "ghost-destructive-foreground",
  ghostPrimary: "ghost-primary-foreground",
  outline: "outline-foreground",
  outlinePrimary: "primary",
  outlineSuccess: "success-foreground",
};

const IconButton: FC<IProps> = ({
  text,
  icon,
  iconPosition = "left",
  variant = "default",
  bordered,
  size,
  children,
  ...extraProps
}) => {
  const iconVariant = icon ? buttonToIconVariantMap[variant ?? "default"] : undefined;

  return (
    <Button
      className="group flex w-full gap-2 font-light uppercase tracking-widest opacity-100 transition-all disabled:opacity-50"
      variant={variant ?? "default"}
      size={size ?? "default"}
      bordered={bordered}
      {...extraProps}
    >
      {icon && iconPosition == "left" && (
        <CustomIcon icon={icon} variant={iconVariant ?? "foreground"} />
      )}
      {text && <p>{text}</p>}
      {children}
      {icon && iconPosition == "right" && (
        <CustomIcon icon={icon} variant={iconVariant ?? "foreground"} />
      )}
    </Button>
  );
};

export default IconButton;
