import { LoadingIndicator } from "@/components/Indicators";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import SearchTableRow from "../SearchTableRow";
import LoginPromptMockTable from "./LoginPromptMockTable";

const HistoryTable = ({}) => {
  const { data: historyEntries, isLoading } = api.song.getHistory.useQuery();
  const { status } = useSession();
  const { t } = useTranslation();
  const loggedIn = status === "authenticated";

  const promptText = t("auth.prompts.history");
  const noHistoryYet = t("search.tabs.history.empty");

  if (!loggedIn) {
    return <LoginPromptMockTable promptText={promptText} icon="signIn" />;
  }
  if (isLoading) {
    return (
      <div className="flex h-full justify-center">
        <LoadingIndicator size={32} />
      </div>
    );
  }
  if (historyEntries?.length == 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>{noHistoryYet}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full px-3 sm:px-5 md:px-7">
      <div className="hide-scrollbars relative h-full w-full overflow-scroll pb-6 pt-12">
        <table className="w-full">
          <tbody>
            {historyEntries?.map((historyEntry, index) => (
              <SearchTableRow key={`${historyEntry.song.id}/${index}`} track={historyEntry.song} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
