import { fadeFromAboveIO, growIn } from "@/helpers/animations";
import useRegion from "@/hooks/useRegion";
import { useLocalStorage } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Cog } from "lucide-react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import IconButton from "../IconButton";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

interface IProps {}

const SearchSettings: FC<IProps> = ({}) => {
  const { t } = useTranslation("");

  // State
  const [searchForClubMixesOnly, setSearchForClubMixesOnly] = useLocalStorage(
    "clubmixesonly",
    false,
  );
  const [minimumLengthOption, setMinimumLengthOption] = useLocalStorage(
    "minimumlengthoption",
    false,
  );
  const [minimumLengthSeconds, setMinimumLengthSeconds] = useLocalStorage("minimumlength", 120);
  const { region, changeRegion, createRegionName, setRegionByLocation, sortedRegions } =
    useRegion();

  // Prepared strings
  const minimumLengthDisplayMinutes = Math.floor(minimumLengthSeconds / 60)
    .toString()
    .padStart(2, "0");
  const minimumLengthDisplaySeconds = (minimumLengthSeconds % 60).toString().padStart(2, "0");

  return (
    <Popover>
      <PopoverTrigger>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Cog />
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="relative flex flex-col gap-4 border-foreground/30 bg-background px-6 py-4 text-foreground">
        {/* <div className="absolute inset-0 -z-10 bg-background opacity-80" /> */}

        <p className="text-center text-lg  text-foreground underline underline-offset-8">
          {t("search.settings.title")}
        </p>
        <div className="grid grid-cols-[240px_minmax(50px,_max-content)] gap-x-8 gap-y-3 opacity-100">
          {/* Minimum length */}
          <Label htmlFor="minimumlength" className="flex items-center font-thin">
            <p>
              {t("search.settings.setMinimumLength")}
              {minimumLengthOption ? ":" : "?"}
            </p>
          </Label>
          <div className="flex h-10 items-center justify-end">
            <Switch
              id="minimumlength"
              checked={minimumLengthOption}
              onCheckedChange={setMinimumLengthOption}
            />
          </div>
          <AnimatePresence mode="popLayout">
            {minimumLengthOption && (
              <motion.div
                className="col-span-2 mx-auto flex w-4/5 cursor-pointer items-center justify-center gap-4 py-2"
                {...fadeFromAboveIO}
                key="mnimumlengthslider"
              >
                <span className="font-normal">
                  {minimumLengthDisplayMinutes}:{minimumLengthDisplaySeconds}
                </span>
                <Slider
                  defaultValue={[minimumLengthSeconds]}
                  max={600}
                  min={1}
                  value={[minimumLengthSeconds]}
                  onValueChange={(value) => setMinimumLengthSeconds(value[0] ?? 0)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Club Mixes only */}
          <Label htmlFor="clubmixesonly" className="flex items-center font-thin">
            {t("search.settings.searchForClubMixesOnly")}
            {!searchForClubMixesOnly && <span>?</span>}
          </Label>
          <div className="flex h-10 items-center justify-end">
            <Switch
              id="clubmixesonly"
              checked={searchForClubMixesOnly}
              onCheckedChange={setSearchForClubMixesOnly}
            />
          </div>

          {/* Region */}
          <div className="flex items-center">
            <Label htmlFor="region" className="flex items-center font-thin">
              {t("search.settings.region")}:
            </Label>
            <Select onValueChange={changeRegion} value={region}>
              <SelectTrigger
                id="region"
                className="h-9 max-w-44 justify-start gap-2 text-ellipsis border-none px-1 text-base text-foreground focus:ring-0 focus:ring-offset-0"
              >
                <motion.div
                  key={region}
                  {...growIn}
                  className="inline-block max-w-32 overflow-hidden text-ellipsis"
                >
                  <SelectValue />
                </motion.div>
              </SelectTrigger>
              <SelectContent>
                {sortedRegions.map((region) => (
                  <SelectItem key={region} value={region.toLowerCase()}>
                    {createRegionName(region)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex h-10 items-center justify-center">
            <IconButton
              variant="ghostPrimary"
              size="icon"
              icon="mapPin"
              iconSize="28px"
              bordered="default"
              onClick={setRegionByLocation}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSettings;
