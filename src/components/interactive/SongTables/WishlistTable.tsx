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
  const noWishlistYet = t("search.tabs.wishlist.empty");

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
  if (wishlistEntries?.length == 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>{noWishlistYet}</p>
      </div>
    );
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
