import { fadeInUp } from "@/helpers/animations";
import {
  countryNamesEnglish,
  countryNamesGerman,
  countryNamesSpanish,
  isRegion,
  Region,
  Regions,
  sortRegions,
} from "@/helpers/region";
import useUserSettings from "@/hooks/useUserSettings";
import { iso1A2Code } from "@rapideditor/country-coder"; // ESM import named
import { useLocalStorage } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Cog } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { toast } from "sonner";
import IconButton from "../IconButton";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

interface IProps {}

const SearchSettings: FC<IProps> = ({}) => {
  const router = useRouter();
  const [searchForClubMixesOnly, setSearchForClubMixesOnly] = useLocalStorage(
    "clubmixesonly",
    false,
  );
  const [minimumLengthOption, setMinimumLengthOption] = useLocalStorage(
    "minimumlengthoption",
    false,
  );
  const [region, setRegion] = useLocalStorage("region", "de");
  const [minimumLengthSeconds, setMinimumLengthSeconds] = useLocalStorage("minimumlength", 120);
  const { t } = useTranslation("");
  const { status, data: userData } = useSession();
  const loggedIn = status === "authenticated";
  const {
    getUserSettings,
    userSettingsUpdaters: { updatePreferredRegion },
  } = useUserSettings(userData?.user.id);
  const userSettings = getUserSettings();

  const regionText = t("search.settings.region");
  const minimumLengthText = t("search.settings.setMinimumLength");
  const searchForClubMixesOnlyText = t("search.settings.searchForClubMixesOnly");

  const minimumLengthDisplayMinutes = Math.floor(minimumLengthSeconds / 60)
    .toString()
    .padStart(2, "0");
  const minimumLengthDisplaySeconds = (minimumLengthSeconds % 60).toString().padStart(2, "0");
  const findMeText = t("search.settings.locateMe");
  const locationRetrievalErrorText = t("toast.retrieveLocation.error");
  const locationRetrievalSuccessText = t("toast.retrieveLocation.success");

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

  const findUser = () => {
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
          toast.success(`${locationRetrievalSuccessText} ${createRegionName(countryCode)}`);
        } else {
          toast.error(locationRetrievalErrorText, { dismissible: true, duration: Infinity });
        }
      },
      () => {
        toast.error(locationRetrievalErrorText, { dismissible: true, duration: Infinity });
      },
    );
  };

  return (
    <Popover>
      <PopoverTrigger>
        <motion.div whileHover={{ rotateZ: 30 }} whileTap={{ scale: 0.9 }}>
          <Cog />
        </motion.div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid grid-cols-[auto_minmax(50px,_max-content)] gap-x-8 gap-y-3">
          {/* Region */}
          <div className="flex items-center">
            <Label htmlFor="region" className="flex items-center font-thin">
              {regionText}:
            </Label>
            <Select onValueChange={changeRegion} value={region}>
              <SelectTrigger
                id="region"
                className="h-9 max-w-32 text-ellipsis border-none bg-primary px-2 text-base font-thin text-primary-foreground"
              >
                <motion.div key={region} {...fadeInUp}>
                  <SelectValue />
                </motion.div>
              </SelectTrigger>
              <SelectContent invert>
                {sortedRegions.map((region) => (
                  <SelectItem key={region} invert value={region.toLowerCase()}>
                    {createRegionName(region)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex h-10 items-center justify-center">
            <IconButton
              variant="ghost"
              size="icon"
              icon="pin"
              iconSize="24px"
              bordered="noBorder"
              onClick={findUser}
            />
          </div>

          {/* Minimum length */}
          <Label htmlFor="minimumlength" className="flex items-center font-thin">
            <p>
              {minimumLengthText}{" "}
              {minimumLengthOption && (
                <span className="font-normal">
                  ({minimumLengthDisplayMinutes}:{minimumLengthDisplaySeconds})
                </span>
              )}
            </p>
          </Label>
          <div className="flex h-10 items-center justify-end">
            <Switch
              id="minimumlength"
              checked={minimumLengthOption}
              onCheckedChange={setMinimumLengthOption}
            />
          </div>
          {minimumLengthOption == true && (
            <AnimatePresence mode="wait">
              <motion.div
                className="col-span-2 mx-auto flex w-2/3 cursor-pointer items-center justify-center py-2"
                initial={{ opacity: 0, marginTop: -8 }}
                animate={{ opacity: 1, marginTop: 0 }}
                exit={{ opacity: 0, marginTop: -8 }}
                key="mnimumlengthslider"
              >
                <Slider
                  defaultValue={[minimumLengthSeconds]}
                  max={600}
                  min={1}
                  value={[minimumLengthSeconds]}
                  onValueChange={(value) => setMinimumLengthSeconds(value[0] ?? 0)}
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Club Mixes only */}
          <Label htmlFor="clubmixesonly" className="flex items-center font-thin">
            {searchForClubMixesOnlyText}
          </Label>
          <div className="flex h-10 items-center justify-end">
            <Switch
              id="clubmixesonly"
              checked={searchForClubMixesOnly}
              onCheckedChange={setSearchForClubMixesOnly}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSettings;
