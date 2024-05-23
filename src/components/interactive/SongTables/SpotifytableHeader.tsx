import { useTranslation } from "next-i18next";
import { SpotifyTableTab, spotifyTableTabs } from "./SpotifyTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SpotifyTableHeaderProps {
  tab: SpotifyTableTab;
  setTab: (newTab: SpotifyTableTab) => void;
}

const SpotifyTableHeader = ({ tab, setTab: handleTabUpdate }: SpotifyTableHeaderProps) => {
  const { t } = useTranslation("");

  return (
    <div className="flex w-full items-center justify-center gap-4">
      {spotifyTableTabs.map((spotifyTableTab) => (
        <button
          id={spotifyTableTab}
          className={cn(
            "whitespace-nowrap transition-colors hover:text-foreground",
            spotifyTableTab === tab ? "font-bold" : "font-normal",
          )}
          onClick={() => handleTabUpdate(spotifyTableTab)}
        >
          {t(`search.spotify.${spotifyTableTab}.header`)}
        </button>
      ))}
    </div>
  );
};

export default SpotifyTableHeader;
