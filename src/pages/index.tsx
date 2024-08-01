import SearchBar from "@/components/interactive/Search/SearchBar";
import SearchTabs from "@/components/interactive/Search/SearchTabs";
import type { GetStaticProps, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../next-i18next.config.mjs";

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
