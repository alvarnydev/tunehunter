import { type CustomIconType, type CustomIconVariant } from "@/helpers/custom-icons";
import { ReactNode, type ButtonHTMLAttributes, type FC } from "react";
import CustomIcon from "./CustomIcon";
import { Button, type CustomButtonSizeVariant, type CustomButtonVariant } from "./ui/button";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: CustomIconType;
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

  link: "link-foreground",
  ghost: "ghost-foreground",
  ghostDestructive: "ghost-destructive-foreground",
  outline: "outline-foreground",
  outlinePrimary: "primary-foreground",
};

const IconButton: FC<IProps> = ({
  text,
  icon,
  variant = "default",
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
      {...extraProps}
    >
      {icon && (
        <CustomIcon icon={icon} height="22px" width="22px" variant={iconVariant ?? "foreground"} />
      )}
      {text && <p>{text}</p>}
      {children}
    </Button>
  );
};

export default IconButton;
