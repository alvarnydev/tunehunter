import { MusicPlayingIndicator } from "@/components/MusicPlayingIndicator";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { SpotifyTrack } from "@/types/spotify";
import { useTranslation } from "next-i18next";

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
    <tr key={track.disc_number} className="">
      <td className="py-2 pr-2">
        <div className="flex items-center">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={track.album.images[0]?.url} />
            </div>
          </div>
        </div>
      </td>
      <td>
        <p>{track.artists[0]?.name}</p>
        {track.artists[1] && <p className="text-muted-foreground">{track.artists[1]?.name}</p>}
      </td>
      <td>{track.name}</td>
      <td className="text-right">
        <Button variant="primary" size="sm" className="capitalize tracking-wide">
          {searchText}
        </Button>
      </td>
    </tr>
  );
};

export default SearchTableRow;
