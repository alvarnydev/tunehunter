import useSpotifyData from "@/hooks/useSpotifyData";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import SearchTableRow from "../SearchTableRow";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const spotifyTableTabs = ["recentlyPlayed", "queue", "topTracks"] as const;
export type SpotifyTableTab = (typeof spotifyTableTabs)[number];

const SpotifyTable = () => {
  console.log("hi");
  const [tab, setTab] = useState<SpotifyTableTab>("recentlyPlayed");
  const { t } = useTranslation();
  const { data: userData, status } = useSession();
  const { data: spotifyAccountData, isLoading: spotifyAccountDataLoading } =
    api.account.getSpotifyAccountById.useQuery(undefined, { refetchOnWindowFocus: false });
  const { spotifyData, isLoading: spotifyDataLoading } = useSpotifyData(
    spotifyAccountData?.access_token || "",
  );

  const loggedIn = status === "authenticated";
  const tabChooserPrompt = t("spotifyBox.prompt");
  const recentlyPlayedEmpty = t("search.spotify.recentlyPlayed.empty");
  const topTracksEmpty = t("search.spotify.topTracks.empty");
  const queueEmpty = t("search.spotify.queue.empty");

  if (!spotifyAccountData) {
    // Please connect your spotify account using this link:
    return;
  }

  if (!spotifyData) {
    // We could not fetch the data for your account
    return;
  }

  return (
    <>
      <div className="absolute left-1/2 top-0 flex w-full max-w-[450px] -translate-x-1/2 items-center justify-around rounded-b-sm border-x-2 border-b-2 border-primary bg-background px-1 py-[6px]">
        {spotifyTableTabs.map((spotifyTableTab) => (
          <button
            id={spotifyTableTab}
            className={cn(
              "whitespace-nowrap text-base transition-colors hover:text-foreground",
              spotifyTableTab === tab ? "text-foreground" : "text-muted-foreground",
            )}
            onClick={() => setTab(spotifyTableTab)}
          >
            {t(`search.spotify.${spotifyTableTab}.header`)}
          </button>
        ))}
      </div>
      <div className="hide-scrollbars h-full w-full overflow-scroll pt-12">
        <table className="w-full">
          <tbody>
            {tab == "recentlyPlayed" && (
              <>
                {spotifyData.recentlyPlayed?.items.length == 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center">{recentlyPlayedEmpty}</p>
                  </div>
                ) : (
                  <>
                    {spotifyData.currentlyPlaying?.is_playing && (
                      <SearchTableRow
                        track={spotifyData.currentlyPlaying.item}
                        currentlyPlaying={true}
                      />
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
                  <>
                    {spotifyData.topTracks?.items.map((track) => <SearchTableRow track={track} />)}
                  </>
                )}
              </>
            )}
            {tab == "queue" && (
              <>
                {spotifyData.queue?.queue.length == 0 ? (
                  <div className="absolute-center flex items-center justify-center">
                    <p className="text-center">{queueEmpty}</p>
                  </div>
                ) : (
                  <>{spotifyData.queue?.queue.map((track) => <SearchTableRow track={track} />)}</>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SpotifyTable;

{
  /* <div className="w-3/4 rounded-xl px-2 pt-2 shadow-md shadow-neutral">
  <div className="mx-[2%] flex justify-center border-b-[1px] border-b-neutral py-2">
    <div className="flex w-full items-center justify-between">
      <div>
        <p>{tabChooserPrompt}</p>
      </div>
      <div className="join">
        {spotifyTableTabs.map((spotifyTableTab) => (
          <button
            id={spotifyTableTab}
            className={`btn btn-ghost join-item btn-sm rounded-l-full text-base capitalize tracking-wide ${spotifyTableTab === tab ? "font-bold" : "font-normal"}`}
            onClick={() => handleTabUpdate(spotifyTableTab)}
          >
            {t(`spotifyBox.${spotifyTableTab}`)}
          </button>
        ))}
      </div>
    </div>
  </div>
  <div className={`scrollbar-none w-full resize-y overflow-x-auto rounded py-2`}>
    <table className="table w-full table-fixed">
      <SpotifyTableBody tab={tab} spotifyData={spotifyData} />
    </table>
  </div>
</div>; */
}
