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
    <TableRow key={track.disc_number}>
      <TableCell className="font-medium">
        <img src={track.album.images[0]?.url} className="relative h-10 w-10 rounded-xl" />
      </TableCell>
      <TableCell>{track.artists[0]?.name}</TableCell>
      <TableCell>{track.name}</TableCell>
      <TableCell className="text-right">
        <Button variant="primary" size="sm" className="capitalize tracking-wide">
          {searchText}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default SearchTableRow;
