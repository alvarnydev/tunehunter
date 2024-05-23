import useSpotifyData from "@/hooks/useSpotifyData";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRef, useState } from "react";
import SearchTableRow from "../SearchTableRow";
import SpotifyTableBody from "./SpotifyTableBody";
import SearchTable from "../SearchTable";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SpotifyTableHeader from "./SpotifytableHeader";

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
      <SpotifyTableHeader tab={tab} setTab={setTab} />
      <SpotifyTableBody tab={tab} spotifyData={spotifyData} />
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
