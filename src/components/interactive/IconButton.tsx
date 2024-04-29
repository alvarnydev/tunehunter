import { type CustomIconType, type CustomIconVariant } from "@/helpers/custom-icons";
import { type ButtonHTMLAttributes, type FC } from "react";
import CustomIcon from "../CustomIcon";
import { Button, type CustomButtonVariant } from "../ui/button";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: CustomIconType;
  text?: string;
  buttonVariant?: CustomButtonVariant;
  iconVariant?: CustomIconVariant;
}

const IconButton: FC<IProps> = ({
  text,
  icon,
  iconVariant,
  buttonVariant,
  children,
  ...extraProps
}) => {
  return (
    <Button
      {...extraProps}
      className="flex gap-2 px-8 py-6 font-light uppercase tracking-widest opacity-100 transition-opacity duration-300 disabled:opacity-50"
      variant={buttonVariant ?? "default"}
    >
      <CustomIcon icon={icon} height="22px" width="22px" variant={iconVariant ?? "foreground"} />
      {text && <p>{text}</p>}
      {children}
    </Button>
  );
};

export default IconButton;
