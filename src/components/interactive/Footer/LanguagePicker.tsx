import { isLocale, Locales, type Locale } from "@/helpers/lang";
import useDeviceSize from "@/hooks/useDeviceSize";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface LanguagePickerProps {
  preferredLanguage?: string | null;
  updatePreferredLanguage?: (language: Locale) => void;
}

const LanguagePicker = ({ preferredLanguage, updatePreferredLanguage }: LanguagePickerProps) => {
  const router = useRouter();
  const { isSmallDevice } = useDeviceSize();
  const { t } = useTranslation("");
  const { pathname, asPath, query } = router;
  const { status } = useSession();
  const loggedIn = status === "authenticated";
  console.log("rendering picker");

  const placeholderValue = isSmallDevice ? "EN" : t(`lang.${router.locale}`);
  const languageText = (locale: string) =>
    isSmallDevice ? locale.toUpperCase() : t(`lang.${locale}`);

  const changeLanguage = async (newLocale: Locale) => {
    console.log("changing language");
    if (loggedIn) {
      console.log("updating preferred lang");
      updatePreferredLanguage?.(newLocale);
    }

    document.cookie = `NEXT_LOCALE=${newLocale}; max-age=31536000; SameSite=Lax; path=/`;
    console.log("newLocale", newLocale);
    await router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  // Set language from DB
  useEffect(() => {
    console.log("hi from effect");
    const currentLanguage = router.locale;
    if (preferredLanguage && isLocale(preferredLanguage) && preferredLanguage !== currentLanguage) {
      console.log(" > yes");
      changeLanguage(preferredLanguage);
    }
  }, [preferredLanguage]);

  return (
    <Select onValueChange={changeLanguage} value={router.locale}>
      <SelectTrigger className="w-20 border-[1px] border-foreground/30 md:w-32">
        <SelectValue placeholder={placeholderValue} />
      </SelectTrigger>
      <SelectContent>
        {Locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {languageText(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguagePicker;
