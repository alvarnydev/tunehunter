import IconButton from "@/components/IconButton";
import { LoadingIndicator } from "@/components/Indicators";
import { signInWithProvider } from "@/helpers/sign-in";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import useSpotifyData from "@/hooks/useSpotifyData";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
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

  if (!loggedIn) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-fit">
          <IconButton
            icon={"spotify"}
            text={signInWithProviderText("Spotify")}
            size="lg"
            onClick={() => signInWithProvider("spotify", router.locale ?? "")}
          />
        </div>
      </div>
    );
  }

  if (spotifyAccountDataLoading) {
    return <LoadingIndicator size={32} />;
  }

  if (!spotifyAccount) {
    const spotifyPrompt = t("search.spotify.connectPrompt");
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-fit">
          <IconButton text={spotifyPrompt} icon="spotify" size="lg" />
        </div>
      </div>
    );
  }

  if (spotifyDataLoading) {
    return <LoadingIndicator size={32} />;
  }

  if (!spotifyData) {
    const dataMissingInfo = t("search.spotify.dataMissing");
    return (
      <div className="gradient flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary to-primary/30">
        <div className="w-fit">
          <IconButton text={dataMissingInfo} icon="spotify" size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full px-3 sm:px-5 md:px-7">
      <div className="absolute left-1/2 top-0 z-10 flex w-full max-w-[450px] -translate-x-1/2 items-center justify-around rounded-b-sm border-x-2 border-b-2 border-primary bg-background px-1 py-[6px]">
        {spotifyTableTabs.map((spotifyTableTab) => (
          <button
            key={spotifyTableTab}
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
      <div className="hide-scrollbars h-full w-full overflow-scroll pb-6 pt-12">
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
                        key={spotifyData.currentlyPlaying.item.id}
                        track={spotifyData.currentlyPlaying.item}
                        currentlyPlaying={true}
                      />
                    )}
                    {spotifyData.recentlyPlayed?.items.map((track, index) => (
                      <SearchTableRow key={`${track.track.id}/${index}`} track={track.track} />
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpotifyTable;
