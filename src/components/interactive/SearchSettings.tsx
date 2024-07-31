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
  const [minimumLength, setMinimumLength] = useLocalStorage("minimumlength", 120);
  const [resultsView, setResultsView] = useLocalStorage("resultsview", "next-page"); // Or below
  const { t } = useTranslation("");

  const searchForClubMixesOnlyText = t("search.settings.searchForClubMixesOnly");
  const minimumLengthText = t("search.settings.setMinimumLength");
  const minutesText = t("search.settings.minutes");
  const resultsViewText = t("search.settings.resultsView");

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
          <div className="flex h-8 items-center">
            <Switch
              id="clubmixesonly"
              checked={searchForClubMixesOnly}
              onCheckedChange={setSearchForClubMixesOnly}
            />
          </div>

          <Label htmlFor="minimumlength" className="flex items-center font-thin">
            <p>{minimumLengthText}</p>
          </Label>
          <div className="flex h-8 items-center">
            <Switch
              id="minimumlength"
              checked={minimumLengthOption}
              onCheckedChange={setMinimumLengthOption}
            />
          </div>

          {minimumLengthOption == true && (
            <AnimatePresence>
              <motion.div
                className="flex h-8 items-center justify-end"
                initial={{ opacity: 0, marginTop: -12 }}
                animate={{ opacity: 1, marginTop: 0 }}
                exit={{ opacity: 0, marginTop: -12 }}
              >
                <span>{minimumLength}:00</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, marginTop: -12 }}
                animate={{ opacity: 1, marginTop: 0 }}
                exit={{ opacity: 0, marginTop: -12 }}
              >
                <Slider
                  defaultValue={[minimumLength]}
                  max={600}
                  step={1}
                  // value={minimumLength}
                  // on={setMinimumLength}
                />
              </motion.div>
            </AnimatePresence>
          )}

          <Label htmlFor="resultsview" className="flex items-center font-thin">
            {resultsViewText}
          </Label>
          <RadioGroup defaultValue="page">
            <div className="flex items-center space-x-2 ">
              <RadioGroupItem
                value="next-page"
                id="next-page"
                onChange={() => setResultsView("next-page")}
              />
              <Label htmlFor="next-page">Next Page</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="below" />
              <Label htmlFor="below">Below</Label>
            </div>
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSettings;
