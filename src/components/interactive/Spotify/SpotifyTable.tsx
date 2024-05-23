import useSpotifyData from "@/hooks/useSpotifyData";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";

export const spotifyTableTabs = ["recentlyPlayed", "queue", "mostPlayed"] as const;
export type SpotifyTableTab = (typeof spotifyTableTabs)[number];

const SpotifyTable = () => {
  const tableHeight = useRef(208);
  const tableScroll = useRef(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<SpotifyTableTab>("recentlyPlayed");
  const { t } = useTranslation();
  const { data, status } = useSession();
  const { data: spotifyAccount } = api.account.getSpotifyAccountById.useQuery(
    {
      userId: data?.user.id!,
    },
    { enabled: data !== null },
  );
  const { spotifyData, isLoading } = useSpotifyData(spotifyAccount?.access_token || "");

  const loggedIn = status === "authenticated";
  console.log("user", data?.user);
  console.log("spotifyaccount", spotifyAccount);
  console.log("spotifyData", spotifyData);

  const tabChooserPrompt = t("spotifyBox.prompt");

  const handleTabUpdate = (newTab: SpotifyTableTab) => {
    setTab(newTab);
  };

  return (
    <div className="w-3/4 rounded-xl px-2 pt-2 shadow-md shadow-neutral">
      <div className="mx-[2%] flex justify-center border-b-[1px] border-b-neutral py-2">
        <div className="flex w-full items-center justify-between">
          <div>
            <p>{tabChooserPrompt}</p>
          </div>
          <div className="join">
            {spotifyTableTabs.map((spotifyTableTab) => (
              <button
                className={`btn btn-ghost join-item btn-sm rounded-l-full text-base capitalize tracking-wide ${spotifyTableTab === tab ? "font-bold" : "font-normal"}`}
                onClick={() => handleTabUpdate(spotifyTableTab)}
              >
                {t(`spotifyBox.${spotifyTableTab}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={tableRef}
        className={`scrollbar-none w-full resize-y overflow-x-auto rounded py-2 h-[${tableHeight}px]`}
      >
        {/* {tab == "recentlyPlayed" && <RecentlyPlayedTable data={userData} />}
        {tab == "mostPlayed" && <MostPlayedTable data={userData} />}
        {tab == "queue" && <QueueTable data={userData} />} */}
      </div>
    </div>
  );
};

export default SpotifyTable;
