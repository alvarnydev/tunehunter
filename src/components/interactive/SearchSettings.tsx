import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isRegion, Region, Regions } from "@/helpers/region";
import useUserSettings from "@/hooks/useUserSettings";
import { iso1A2Code } from "@rapideditor/country-coder"; // ESM import named
import { useLocalStorage } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Cog } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { FC, useEffect } from "react";
import { toast } from "sonner";
import IconButton from "../IconButton";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

interface IProps {}

const SearchSettings: FC<IProps> = ({}) => {
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
  const [resultsView, setResultsView] = useLocalStorage("resultsview", "new-page"); // Or below
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
          toast.success(`${locationRetrievalSuccessText} ${countryCode}`);
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
        <div className="grid grid-cols-[auto_minmax(100px,_max-content)] gap-x-4 gap-y-3  ">
          {/* Region */}
          <div className="flex items-center gap-2">
            <Label htmlFor="region" className="flex items-center font-thin">
              {regionText}
            </Label>

            <div className="w-auto">
              <IconButton
                variant="outline"
                className="gap-1 text-xs"
                size="xs"
                icon="pin"
                bordered="noBorder"
                text={findMeText}
                onClick={findUser}
              />
            </div>
          </div>
          <div className="flex h-10 items-center justify-end">
            <Select onValueChange={changeRegion} value={region}>
              <SelectTrigger className="h-9 w-20" invert>
                <SelectValue />
              </SelectTrigger>
              <SelectContent invert>
                {Regions.map((region) => (
                  <SelectItem key={region} invert value={region.toLowerCase()}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                className="col-span-2 mx-auto flex w-2/3 cursor-pointer items-center justify-center"
                initial={{ opacity: 0, marginTop: -12 }}
                animate={{ opacity: 1, marginTop: 0 }}
                exit={{ opacity: 0, marginTop: -12 }}
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

          {/* Results view */}
          {/* <Label htmlFor="resultsview" className="flex items-center font-thin">
            {resultsViewText}
          </Label>
          <div className="flex h-10 items-end justify-center">
            <RadioGroup defaultValue="new-page" onValueChange={setResultsView} value={resultsView}>
              <div className="flex items-center space-x-2 ">
                <RadioGroupItem
                  value="new-page"
                  id="new-pageoption"
                  onChange={() => setResultsView("new-page")}
                />
                <Label htmlFor="new-pageoption" className="cursor-pointer">
                  {newPageText}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="below" id="belowoption" />
                <Label htmlFor="belowoption" className="cursor-pointer">
                  {belowText}
                </Label>
              </div>
            </RadioGroup>
          </div> */}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSettings;
