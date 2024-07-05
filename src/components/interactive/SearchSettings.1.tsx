import { useLocalStorage } from "@uidotdev/usehooks";
import { Cog } from "lucide-react";
import { useTranslation } from "next-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";

export const SearchSettings = ({}) => {
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
          <p className="flex items-center font-thin">{searchForClubMixesOnlyText}</p>
          <div className="flex h-8 items-center">
            <Switch checked={searchForClubMixesOnly} onCheckedChange={setSearchForClubMixesOnly} />
          </div>
          {/* <p className="font-thin">Region</p> */}
        </div>
      </PopoverContent>
    </Popover>
  );
};
