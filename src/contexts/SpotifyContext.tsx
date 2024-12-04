import { SpotifyData } from "@/types/spotify";
import { createContext, ReactNode, useContext, useState } from "react";

interface ISpotifyContext {
  spotifyData: SpotifyData | null;
  setSpotifyData: (data: SpotifyData) => void;
  spotifyDataLoading: boolean;
  setSpotifyDataLoading: (loading: boolean) => void;
}

const SpotifyContext = createContext<ISpotifyContext>({
  spotifyData: null,
  setSpotifyData: () => {},
  spotifyDataLoading: false,
  setSpotifyDataLoading: () => {},
});

export const useSpotifyContext = () => useContext(SpotifyContext);

export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [spotifyDataLoading, setSpotifyDataLoading] = useState(false);

  return (
    <SpotifyContext.Provider
      value={{ spotifyData, setSpotifyData, spotifyDataLoading, setSpotifyDataLoading }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
