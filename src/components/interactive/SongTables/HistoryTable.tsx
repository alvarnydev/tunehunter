import { LoadingIndicator } from "@/components/Indicators";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import LoginPromptMockTable from "./LoginPromptMockTable";

const HistoryTable = ({}) => {
  const { data, isLoading } = api.song.getHistory.useQuery();
  const { status } = useSession();
  const { t } = useTranslation();
  const loggedIn = status === "authenticated";

  const promptText = t("auth.prompts.history");

  if (!loggedIn) {
    return <LoginPromptMockTable promptText={promptText} icon="signIn" />;
  }
  if (isLoading) {
    return <LoadingIndicator size={32} />;
  }

  return <div>Hi</div>;
};

export default HistoryTable;
