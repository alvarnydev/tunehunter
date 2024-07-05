import { useLocalStorage } from "@uidotdev/usehooks";
import { Cog } from "lucide-react";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";

interface IProps {}

const SearchSettings: FC<IProps> = ({}) => {
  const [searchForClubMixesOnly, setSearchForClubMixesOnly] = useLocalStorage(
    "clubmixesonly",
    false,
  );
  const { t } = useTranslation("");

  const searchForClubMixesOnlyText = t("profile.settings.searchForClubMixesOnly");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Cog />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid w-full grid-cols-[auto_min-content] gap-4">
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
          {/* <p className="font-thin">Region</p> */}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSettings;
