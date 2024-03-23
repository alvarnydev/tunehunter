import LanguagePicker from "../interactive/LanguagePicker";
import { ThemeToggle } from "../interactive/ThemeToggle";
import ProfileButton from "../interactive/ProfileButton";

const Footer = () => {
  return (
    <div className="flex h-20 w-full items-center bg-muted">
      <div className="flex-1 flex justify-center">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex justify-center">
        <ProfileButton />
      </div>
      <div className="flex-1 flex justify-center">
        <LanguagePicker />
      </div>
    </div>
  );
};

export default Footer;
