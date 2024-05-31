import { combinedFetchSpotifyData } from "@/helpers/fetch-spotify-data";
import { SpotifyData } from "@/types/spotify";
import { useEffect, useState } from "react";

const useSpotifyData = (accessToken: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [spotifyData, setSpotifyData] = useState<SpotifyData>();

  useEffect(() => {
    if (!accessToken) return;
    let ignore = false;
    setIsLoading(true);

    const loadData = async () => {
      try {
        const response = await combinedFetchSpotifyData(accessToken);
        if (ignore) return;
        setSpotifyData(response);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [accessToken]);

  return { spotifyData, isLoading };
};

export default useSpotifyData;
