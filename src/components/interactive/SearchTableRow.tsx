import { MusicPlayingIndicator } from "@/components/MusicPlayingIndicator";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { SpotifyTrack } from "@/types/spotify";
import { useTranslation } from "next-i18next";
import IconButton from "../IconButton";
import { Search } from "lucide-react";
import CustomIcon from "../CustomIcon";

const SearchTableRow: React.FC<{
  track: SpotifyTrack;
  currentlyPlaying?: boolean;
  userCountry?: string;
}> = ({ track }) => {
  const { t } = useTranslation();

  const searchText = t("general.search");

  const startSearch = () => {
    console.log("searching...");
  };

  return (
    <tr key={track.disc_number} className="max-h-16">
      <td className="py-2 pr-8">
        <div className="flex items-center">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={track.album.images[0]?.url} />
            </div>
          </div>
        </div>
      </td>
      <td className="max-h-16 overflow-hidden pr-4">
        <p>{track.artists[0]?.name}</p>
        {track.artists[1] && (
          <p className="overflow-ellipsis whitespace-nowrap text-muted-foreground">
            {track.artists[1]?.name}
          </p>
        )}
      </td>
      <td className="pr-4">{track.name}</td>
      <td className="text-right">
        <IconButton variant="primary" text={searchText} size="default" />
      </td>
    </tr>
  );
};

export default SearchTableRow;
