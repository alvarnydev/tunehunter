import { LoadingIndicator } from "@/components/Indicators";
import { api } from "@/utils/api";
import SearchTableRow from "../SearchTableRow";

const TrendingTable = ({}) => {
  const { data: trendingEntries, isLoading } = api.song.getTrending.useQuery();

  if (isLoading) {
    return <LoadingIndicator size={32} />;
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
