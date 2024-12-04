import { combinedFetchSpotifyData } from "@/helpers/fetch-spotify-data";
import { SpotifyData } from "@/types/spotify";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ISpotifyContext {
  spotifyData: SpotifyData | null;
  refreshSpotifyData: () => void;
  spotifyDataLoading: boolean;
}

const SpotifyContext = createContext<ISpotifyContext>({
  spotifyData: null,
  refreshSpotifyData: () => {},
  spotifyDataLoading: false,
});

export const useSpotifyContext = () => useContext(SpotifyContext);

export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [spotifyDataLoading, setSpotifyDataLoading] = useState(false);
  const { data: userData } = useSession();

  const { data: spotifyAccountData } = api.account.getSpotifyAccountById.useQuery(
    { userId: userData?.user.id! },
    {
      refetchOnWindowFocus: false,
      enabled: !!userData,
    },
  );
  const accessToken = spotifyAccountData?.data?.access_token;

  const refreshSpotifyData = async () => {
    if (!accessToken) {
      setSpotifyData(null);
      return;
    }
    setSpotifyDataLoading(true);

    try {
      const response = await combinedFetchSpotifyData(accessToken);
      setSpotifyData(response);
      setSpotifyDataLoading(false);
    } catch (error) {
      console.error(error);
      setSpotifyDataLoading(false);
    }
  };

  useEffect(() => {
    refreshSpotifyData();
  }, [accessToken]);

  return (
    <SpotifyContext.Provider
      value={{
        spotifyData,
        refreshSpotifyData,
        spotifyDataLoading,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
