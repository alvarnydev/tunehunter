import { SpotifyData } from "@/types/spotify";
import { createContext, ReactNode, useContext, useState } from "react";

interface ISpotifyContext {
  spotifyData: SpotifyData | null;
  setSpotifyData: (data: SpotifyData) => void;
}

const SpotifyContext = createContext<ISpotifyContext>({
  spotifyData: null,
  setSpotifyData: () => {},
});

export const useSpotify = () => useContext(SpotifyContext);

export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);

  return (
    <SpotifyContext.Provider value={{ spotifyData, setSpotifyData }}>
      {children}
    </SpotifyContext.Provider>
  );
};
