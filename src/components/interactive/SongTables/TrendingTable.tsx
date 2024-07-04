import { LoadingIndicator } from "@/components/Indicators";
import { api } from "@/utils/api";
import { useTranslation } from "react-i18next";
import SearchTableRow from "../SearchTableRow";

const TrendingTable = ({}) => {
  const { data: trendingEntries, isLoading } = api.song.getTrending.useQuery();
  const { t } = useTranslation();

  const nothingTrendingYet = t("search.tabs.trending.empty");

  if (isLoading) {
    return (
      <div className="flex h-full justify-center">
        <LoadingIndicator size={32} />
      </div>
    );
  }
  if (trendingEntries?.length == 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>{nothingTrendingYet}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full px-3 sm:px-5 md:px-7">
      <div className="hide-scrollbars relative h-full w-full overflow-scroll pb-6 pt-12">
        <table className="w-full">
          <tbody>
            {trendingEntries?.map((trendingEntry) => (
              <SearchTableRow key={trendingEntry.song.id} track={trendingEntry.song} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrendingTable;
