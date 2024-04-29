import { CustomIconVariant, type CustomIconType } from "@/helpers/custom-icons";
import { type ButtonHTMLAttributes, type FC } from "react";
import CustomIcon from "../CustomIcon";
import { Button } from "../ui/button";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: CustomIconType;
  text?: string;
  variant?: CustomIconVariant;
}

const IconButton: FC<IProps> = ({ text, icon, variant, children, ...extraProps }) => {
  return (
    <Button
      {...extraProps}
      className="flex gap-2 px-8 py-6 font-light uppercase tracking-widest opacity-100 transition-opacity duration-300 disabled:opacity-50"
    >
      <CustomIcon
        icon={icon}
        height="22px"
        width="22px"
        variant={variant ?? CustomIconVariant.foreground}
      />
      {text && <p>{text}</p>}
      {children}
    </Button>
  );
};

export default IconButton;
