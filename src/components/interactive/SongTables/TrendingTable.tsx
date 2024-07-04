import { LoadingIndicator } from "@/components/Indicators";
import { api } from "@/utils/api";
import SearchTableRow from "../SearchTableRow";

const TrendingTable = ({}) => {
  const { data, isLoading } = api.song.getTrending.useQuery();

  if (isLoading) {
    return <LoadingIndicator size={32} />;
  }

  return (
    <div className="h-full w-full px-3 sm:px-5 md:px-7">
      <div className="hide-scrollbars relative h-full w-full overflow-scroll pb-6 pt-12">
        <table className="w-full">
          <tbody>
            {data?.map((track, index) => <SearchTableRow key={track.id} track={track} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrendingTable;
