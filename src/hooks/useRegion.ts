import {
  countryNamesEnglish,
  countryNamesGerman,
  countryNamesSpanish,
  isRegion,
  Region,
  Regions,
  sortRegions,
} from "@/helpers/region";
import { iso1A2Code } from "@rapideditor/country-coder"; // ESM import named
import { useLocalStorage } from "@uidotdev/usehooks";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";
import useUserSettings from "./useUserSettings";

const useRegion = () => {
  const router = useRouter();
  const { t } = useTranslation("");
  const [region, setRegion] = useLocalStorage("region", "de");
  const { status, data: userData } = useSession();
  const loggedIn = status === "authenticated";
  const {
    getUserSettings,
    userSettingsUpdaters: { updatePreferredRegion },
  } = useUserSettings(userData?.user.id);
  const userSettings = getUserSettings();

  const sortedRegions = sortRegions(Regions, router.locale || "en");

  // Set region from DB
  useEffect(() => {
    const preferredRegion = userSettings?.region;
    if (preferredRegion && isRegion(preferredRegion) && preferredRegion !== region) {
      changeRegion(preferredRegion);
    }
  }, [userSettings]);

  const changeRegion = (newRegion: Region) => {
    if (loggedIn) {
      updatePreferredRegion?.(newRegion);
    }
    setRegion(newRegion);
  };

  const createRegionName = (region: string) => {
    if (router.locale === "de") return countryNamesGerman[region];
    if (router.locale === "es") return countryNamesSpanish[region];
    return countryNamesEnglish[region];
  };

  const setRegionByLocation = () => {
    const userLocation = {
      longitude: 0,
      latitude: 0,
    };

    // Get coordinates from geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.longitude = position.coords.longitude;
        userLocation.latitude = position.coords.latitude;

        const countryCode = iso1A2Code([userLocation.longitude, userLocation.latitude]);

        if (countryCode) {
          changeRegion(countryCode.toLowerCase());
          toast.success(`${t("toast.retrieveLocation.success")} ${createRegionName(countryCode)}`);
        } else {
          toast.error(t("toast.retrieveLocation.error"), { dismissible: true, duration: Infinity });
        }
      },
      () => {
        toast.error(t("toast.retrieveLocation.error"), { dismissible: true, duration: Infinity });
      },
    );
  };

  return {
    region,
    changeRegion,
    createRegionName,
    setRegionByLocation,
    sortedRegions,
  };
};

export default useRegion;
