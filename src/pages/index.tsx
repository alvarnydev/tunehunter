import SearchBar from "@/components/interactive/Search/SearchBar";
import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import nextI18nConfig from "../../next-i18next.config.mjs";
const SearchTabs = dynamic(() => import("@/components/interactive/Search/SearchTabs"), {
  ssr: false,
});

export const Home: NextPage = () => {
  return (
    <div className="-mt-2 flex w-full max-w-4xl flex-col items-center gap-4">
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
