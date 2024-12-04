import SearchBar from "@/components/interactive/Search/SearchBar";
import { useSpotifyContext } from "@/contexts/SpotifyContext";
import useSpotifyData from "@/hooks/useSpotifyData";
import { api } from "@/utils/api";
import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import nextI18nConfig from "../../next-i18next.config.mjs";
const SearchTabs = dynamic(() => import("@/components/interactive/Search/SearchTabs"), {
  ssr: false,
});

export const Home: NextPage = () => {
  const { data: userData } = useSession();

  // Query spotify data if not yet present
  const { data: spotifyAccountData, isLoading: spotifyAccountDataLoading } =
    api.account.getSpotifyAccountById.useQuery(
      { userId: userData?.user.id! },
      {
        refetchOnWindowFocus: false,
        enabled: !!userData,
      },
    );
  const accessToken = spotifyAccountData?.data?.access_token;
  const { spotifyData, isLoading: spotifyDataLoading } = useSpotifyData(accessToken || "");
  const {
    spotifyData: globalSpotifyData,
    setSpotifyData: setGlobalSpotifyData,
    setSpotifyDataLoading: setGlobalSpotifyDataLoading,
  } = useSpotifyContext();

  useEffect(() => {
    setGlobalSpotifyDataLoading(spotifyDataLoading);
    if (!globalSpotifyData) setGlobalSpotifyData(spotifyData!);
  }, [spotifyData]);

  return (
    <div className="-mt-2 flex w-full max-w-4xl flex-col items-center gap-5">
      <SearchBar />
      <SearchTabs />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", "common", nextI18nConfig)),
    },
  };
};

export default Home;
