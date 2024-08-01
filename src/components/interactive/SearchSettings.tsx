import { useLocalStorage } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Cog } from "lucide-react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
  const [minimumLengthSeconds, setMinimumLengthSeconds] = useLocalStorage("minimumlength", 120);
  const [resultsView, setResultsView] = useLocalStorage("resultsview", "new-page"); // Or below
  const { t } = useTranslation("");

  const searchForClubMixesOnlyText = t("search.settings.searchForClubMixesOnly");
  const minimumLengthText = t("search.settings.setMinimumLength");
  const resultsViewText = t("search.settings.resultsView");
  const newPageText = t("search.settings.newPage");
  const belowText = t("search.settings.below");

  const minimumLengthDisplayMinutes = Math.floor(minimumLengthSeconds / 60)
    .toString()
    .padStart(2, "0");
  const minimumLengthDisplaySeconds = (minimumLengthSeconds % 60).toString().padStart(2, "0");

  console.log(searchForClubMixesOnly, minimumLengthOption, minimumLengthSeconds, resultsView);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Cog />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid grid-cols-[auto_minmax(100px,_max-content)] gap-x-8 gap-y-6">
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
            <AnimatePresence>
              <motion.div
                className="col-span-2 mx-auto flex w-2/3 items-center justify-center"
                initial={{ opacity: 0, marginTop: -12 }}
                animate={{ opacity: 1, marginTop: 0 }}
                exit={{ opacity: 0, marginTop: -12 }}
                key="mnimumlengthslider"
              >
                <Slider
                  defaultValue={[minimumLengthSeconds]}
                  max={600}
                  value={[minimumLengthSeconds]}
                  onValueChange={(value) => setMinimumLengthSeconds(value[0] ?? 0)}
                />
              </motion.div>
            </AnimatePresence>
          )}

          <Label htmlFor="resultsview" className="flex items-center font-thin">
            {resultsViewText}
          </Label>
          <div className="flex h-12 items-end justify-center">
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
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSettings;
