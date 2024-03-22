import { ModeToggle } from "../ModeToggle";
import { Switch } from "../ui/switch";

const Footer = () => {
  return (
    <div className="flex h-20 w-full items-center justify-around bg-primary-foreground">
      <ModeToggle />
      <Switch />
      <p>Footer</p>
    </div>
  );
};

export default Footer;
