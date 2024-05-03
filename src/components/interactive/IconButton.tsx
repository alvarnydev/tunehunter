import { type CustomIconType, type CustomIconVariant } from "@/helpers/custom-icons";
import { type ButtonHTMLAttributes, type FC } from "react";
import CustomIcon from "../CustomIcon";
import { Button, type CustomButtonSizeVariant, type CustomButtonVariant } from "../ui/button";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: CustomIconType;
  text?: string;
  buttonVariant?: CustomButtonVariant;
  sizeVariant?: CustomButtonSizeVariant;
  iconVariant?: CustomIconVariant;
}

const IconButton: FC<IProps> = ({
  text,
  icon,
  iconVariant,
  buttonVariant,
  sizeVariant,
  children,
  ...extraProps
}) => {
  return (
    <Button
      {...extraProps}
      className="flex gap-2 font-light uppercase tracking-widest opacity-100 transition-all disabled:opacity-50"
      variant={buttonVariant ?? "default"}
      size={sizeVariant ?? "default"}
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
