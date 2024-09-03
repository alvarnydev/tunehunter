import useUserSettings from "@/hooks/useUserSettings";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import LanguagePicker from "../interactive/Footer/LanguagePicker";
import ProfileButton from "../interactive/Footer/ProfileButton";
import { ThemeToggle } from "../interactive/Footer/ThemeToggle";

const Footer = () => {
  const { data: sessionData } = useSession();
  const {
    getUserSettings,
    userSettingsUpdaters: { updatePreferredTheme, updatePreferredLanguage },
  } = useUserSettings(sessionData?.user.id);
  const userSettings = getUserSettings();

  return (
    <Suspense>
      <div className="flex h-20 w-full items-center bg-muted">
        <div className="flex flex-1 justify-center">
          <ThemeToggle
            preferredTheme={userSettings?.theme}
            updatePreferredTheme={updatePreferredTheme}
          />
        </div>
        <div className="flex flex-1 justify-center">
          <ProfileButton />
        </div>
        <div className="flex flex-1 justify-center">
          <LanguagePicker
            preferredLanguage={userSettings?.language}
            updatePreferredLanguage={updatePreferredLanguage}
          />
        </div>
      </div>
    </Suspense>
  );
};

export default Footer;
