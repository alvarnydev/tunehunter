import { LoadingIndicator } from "@/components/Indicators";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import SearchTableRow from "../SearchTableRow";
import LoginPromptMockTable from "./LoginPromptMockTable";

const WishlistTable = ({}) => {
  const { data: wishlistEntries, isLoading } = api.song.getWishlist.useQuery();
  const { status } = useSession();
  const { t } = useTranslation();
  const loggedIn = status === "authenticated";

  const promptText = t("auth.prompts.wishlist");

  if (!loggedIn) {
    return <LoginPromptMockTable promptText={promptText} icon="signIn" />;
  }
  if (isLoading) {
    return <LoadingIndicator size={32} />;
  }

  return (
    <div className="h-full w-full px-3 sm:px-5 md:px-7">
      <div className="hide-scrollbars relative h-full w-full overflow-scroll pb-6 pt-12">
        <table className="w-full">
          <tbody>
            {wishlistEntries?.map((wishlistEntry) => (
              <SearchTableRow key={wishlistEntry.song.id} track={wishlistEntry.song} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WishlistTable;
