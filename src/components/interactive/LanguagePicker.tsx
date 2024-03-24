import { Locales, type Locale } from "@/helpers/lang";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { type FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useDeviceSize from "@/hooks/useDeviceSize";

const LanguagePicker: FC = () => {
  const router = useRouter();
  const { isSmallDevice } = useDeviceSize();
  const { pathname, asPath, query } = router;

  const { t } = useTranslation("common");
  const placeholderValue = isSmallDevice ? "EN" : t(`lang.${router.locale}`);

  const setLanguage = async (newLocale: Locale) => {
    await router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <Select
      onValueChange={setLanguage}
      // defaultValue={router.locale}
      // value={router.locale}
    >
      <SelectTrigger className="w-20 md:w-32">
        <SelectValue placeholder={placeholderValue} />
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
