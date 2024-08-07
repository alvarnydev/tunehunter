import useUserSettings from "@/hooks/useUserSettings";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { Suspense } from "react";
import LanguagePicker from "../interactive/Footer/LanguagePicker";
import ProfileButton from "../interactive/Footer/ProfileButton";
import { ThemeToggle } from "../interactive/Footer/ThemeToggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const Footer = () => {
  const { t } = useTranslation("");
  const { data: sessionData } = useSession();
  const {
    getUserSettings,
    userSettingsUpdaters: { updatePreferredTheme, updatePreferredLanguage },
  } = useUserSettings(sessionData?.user.id);
  const userSettings = getUserSettings();

  const themeTooltip = t("tooltip.theme");
  const profileTooltip = t("tooltip.profile");
  const languageTooltip = t("tooltip.language");

  return (
    <Suspense>
      <div className="flex h-20 w-full items-center bg-muted">
        <div className="flex flex-1 justify-center">
          <Tooltip>
            <TooltipTrigger>
              <ThemeToggle
                preferredTheme={userSettings?.theme}
                updatePreferredTheme={updatePreferredTheme}
              />
            </TooltipTrigger>
            <TooltipContent>{themeTooltip}</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-1 justify-center">
          <Tooltip>
            <TooltipTrigger>
              <ProfileButton />
            </TooltipTrigger>
            <TooltipContent>{profileTooltip}</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-1 justify-center">
          <Tooltip>
            <TooltipTrigger>
              <LanguagePicker
                preferredLanguage={userSettings?.language}
                updatePreferredLanguage={updatePreferredLanguage}
              />
            </TooltipTrigger>
            <TooltipContent>{languageTooltip}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Suspense>
  );
};

export default Footer;
