import { Locales, type Locale } from "@/helpers/lang";
import { useTranslation } from "next-i18next";
import { type FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/router";

const LanguagePicker: FC = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  console.log("locale", router.locale);

  const { t } = useTranslation("common");

  const setLanguage = async (newLocale: Locale) => {
    await router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <Select
      onValueChange={setLanguage}
      // defaultValue={router.locale}
      // value={router.locale}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder={t(`lang.${router.locale}`)} />
      </SelectTrigger>
      <SelectContent>
        {Locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {t(`lang.${locale}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguagePicker;
