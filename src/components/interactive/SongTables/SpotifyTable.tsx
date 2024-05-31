import IconButton from "@/components/IconButton";
import { LoadingIndicator } from "@/components/Indicators";
import { spotifyMockData } from "@/helpers/mock-spotify-data";
import { signInWithProvider } from "@/helpers/sign-in";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import useSpotifyData from "@/hooks/useSpotifyData";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import SearchTableRow from "../SearchTableRow";

export const spotifyTableTabs = ["recentlyPlayed", "queue", "topTracks"] as const;
export type SpotifyTableTab = (typeof spotifyTableTabs)[number];

const SpotifyTable = () => {
  const [tab, setTab] = useState<SpotifyTableTab>("recentlyPlayed");
  const { t } = useTranslation();
  const router = useRouterWithHelpers();
  const { data: userData, status } = useSession();
  const { data: spotifyAccount, isLoading: spotifyAccountDataLoading } =
    api.account.getSpotifyAccountById.useQuery(
      { userId: userData?.user.id! },
      {
        refetchOnWindowFocus: false,
        enabled: !!userData,
      },
    );
  const { spotifyData, isLoading: spotifyDataLoading } = useSpotifyData(
    spotifyAccount?.access_token || "",
  );

  const loggedIn = status === "authenticated";
  const recentlyPlayedEmpty = t("search.spotify.recentlyPlayed.empty");
  const topTracksEmpty = t("search.spotify.topTracks.empty");
  const queueEmpty = t("search.spotify.queue.empty");
  const signInWithProviderText = (provider: string) => t("auth.signIn.withProvider", { provider });
  const spotifyConnectPrompt = t("search.spotify.connectPrompt");

  if (loggedIn && (spotifyAccountDataLoading || spotifyDataLoading)) {
    return <LoadingIndicator size={32} />;
  }

  return (
    <>
      {(!loggedIn || !spotifyAccount || !spotifyData) && (
        <div className="absolute-center z-30">
          {(!loggedIn || !spotifyAccount) && (
            <IconButton
              icon={"spotify"}
              variant="primary"
              text={spotifyConnectPrompt}
              size="lg"
              onClick={() => signInWithProvider("spotify", router.locale ?? "")}
            />
          )}
          {loggedIn && spotifyAccount && !spotifyData && <>No spotify data received</>}
        </div>
      )}
      <div className="h-full w-full px-3 sm:px-5 md:px-7">
        {(!loggedIn || !spotifyAccount || !spotifyData) && (
          <div className="absolute inset-0 z-20 backdrop-blur-lg" />
        )}
        <div className="absolute left-1/2 top-0 z-10 flex w-full max-w-[450px] -translate-x-1/2 items-center justify-around rounded-b-sm border-x-2 border-b-2 border-primary bg-background px-1 py-[6px]">
          {spotifyTableTabs.map((spotifyTableTab) => (
            <button
              key={spotifyTableTab}
              className={cn(
                "whitespace-nowrap text-base transition-colors hover:text-foreground",
                spotifyTableTab === tab ? "text-foreground" : "text-muted-foreground",
              )}
              onClick={() => setTab(spotifyTableTab)}
              disabled={!spotifyData}
            >
              {t(`search.spotify.${spotifyTableTab}.header`)}
            </button>
          ))}
        </div>
        <div
          className={cn(
            "hide-scrollbars relative h-full w-full pb-6 pt-12",
            spotifyData && "overflow-scroll",
          )}
        >
          <table className="w-full">
            {!spotifyData && (
              <tbody>
                {spotifyMockData.topTracks!.items.map((track) => (
                  <SearchTableRow key={track.id} track={track} />
                ))}
              </tbody>
            )}
            {spotifyData && (
              <AnimatePresence mode="wait">
                <motion.tbody
                  key={tab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
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
                              key={spotifyData.currentlyPlaying.item.id}
                              track={spotifyData.currentlyPlaying.item}
                              currentlyPlaying={true}
                            />
                          )}
                          {spotifyData.recentlyPlayed?.items.map((track, index) => (
                            <SearchTableRow
                              key={`${track.track.id}/${index}`}
                              track={track.track}
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
                          <p className="text-center">{topTracksEmpty}</p>
                        </div>
                      ) : (
                        <>
                          {spotifyData.topTracks?.items.map((track) => (
                            <SearchTableRow key={track.id} track={track} />
                          ))}
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
                        <>
                          {spotifyData.queue?.queue.map((track, index) => (
                            <SearchTableRow key={`${track.id}/${index}`} track={track} />
                          ))}
                        </>
                      )}
                    </>
                  )}
                </motion.tbody>
              </AnimatePresence>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default SpotifyTable;
