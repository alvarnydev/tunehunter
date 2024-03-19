import { ModeToggle } from "../ModeToggle";

const Footer = () => {
  return (
    <div className="flex w-full items-center justify-evenly bg-background/20">
      <ModeToggle />
      <p>Footer</p>
    </div>
  );
};

export default Footer;
