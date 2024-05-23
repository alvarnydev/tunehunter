import { SpotifyData } from "@/types/spotify";
import { SpotifyTableTab } from "./SpotifyTable";
import SearchTableRow from "../SearchTableRow";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";

interface SpotifyTableBodyProps {
  tab: SpotifyTableTab;
  spotifyData: SpotifyData;
}

const SpotifyTableBody = ({ spotifyData, tab }: SpotifyTableBodyProps) => {
  const { t } = useTranslation("");

  const recentlyPlayedEmpty = t("search.spotify.recentlyPlayed.empty");
  const topTracksEmpty = t("search.spotify.topTracks.empty");
  const queueEmpty = t("search.spotify.queue.empty");

  return (
    <TableBody>
      {tab == "recentlyPlayed" && (
        <>
          {spotifyData.recentlyPlayed?.items.length == 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center">{recentlyPlayedEmpty}</p>
            </div>
          ) : (
            <>
              {spotifyData.currentlyPlaying?.is_playing && (
                <SearchTableRow track={spotifyData.currentlyPlaying.item} currentlyPlaying={true} />
              )}
              {spotifyData.recentlyPlayed?.items.map((track) => (
                <SearchTableRow track={track.track} />
              ))}
            </>
          )}
        </>
      )}
      {tab == "topTracks" && (
        <>
          {spotifyData.topTracks?.items.length == 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center">{topTracksEmpty}</p>
            </div>
          ) : (
            <>{spotifyData.topTracks?.items.map((track) => <SearchTableRow track={track} />)}</>
          )}
        </>
      )}
      {tab == "queue" && (
        <>
          {spotifyData.queue?.queue.length == 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center">{queueEmpty}</p>
            </div>
          ) : (
            <>{spotifyData.queue?.queue.map((track) => <SearchTableRow track={track} />)}</>
          )}
        </>
      )}
    </TableBody>
  );
};

export default SpotifyTableBody;
