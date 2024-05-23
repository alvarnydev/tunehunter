import { SpotifyData } from "@/types/spotify";
import { SpotifyTableTab } from "./SpotifyTable";
import SpotifyTableRow from "./SpotifyTableRow";

interface SpotifyTableBodyProps {
  tab: SpotifyTableTab;
  spotifyData: SpotifyData;
}

const SpotifyTableBody = ({ spotifyData, tab }: SpotifyTableBodyProps) => {
  return (
    <tbody>
      {tab == "recentlyPlayed" && (
        <>
          {spotifyData.recentlyPlayed?.items.length == 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center">You have no recently played songs</p>
            </div>
          ) : (
            <>
              {spotifyData.recentlyPlayed?.items.map((track) => (
                <SpotifyTableRow
                  key={track.played_at}
                  trackData={track.track}
                  userCountry="US" // TODO
                />
              ))}
            </>
          )}
        </>
      )}
      {tab == "topTracks" && (
        <>
          {spotifyData.topTracks?.items.length == 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center">We found no data for your most played songs</p>
            </div>
          ) : (
            <>
              {spotifyData.topTracks?.items.map((track) => (
                <SpotifyTableRow
                  key={track.id}
                  trackData={track}
                  userCountry="US" // TODO
                />
              ))}
            </>
          )}
        </>
      )}
      {tab == "queue" && (
        <>
          {spotifyData.queue?.queue.length == 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center">Your queue is currently empty</p>
            </div>
          ) : (
            <>
              {spotifyData.queue?.queue.map((track, index) => (
                <SpotifyTableRow
                  key={track.id + index}
                  trackData={track}
                  userCountry="US" // TODO
                />
              ))}
            </>
          )}
        </>
      )}
    </tbody>
  );
};

export default SpotifyTableBody;
