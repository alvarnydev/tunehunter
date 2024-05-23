import SpotifyTable from "@/components/interactive/SongTables/SpotifyTable";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import type { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import nextI18nConfig from "../../next-i18next.config.mjs";
import TrendingTable from "@/components/interactive/SongTables/TrendingTable";
import WishlistTable from "@/components/interactive/SongTables/WishlistTable";
import HistoryTable from "@/components/interactive/SongTables/HistorTable";
import { Table } from "@/components/ui/table";

const tabs = ["trending", "spotify", "history", "wishlist"] as const;
type Tab = (typeof tabs)[number];

const placeholderValues = [
  "Celine Dion - My Heart Will Go On",
  "Michael Jackson - Thriller",
  "Queen - Bohemian Rhapsody",
  "The Beatles - Hey Jude",
  "Elton John - Your Song",
  "Adele - Someone Like You",
  "Ed Sheeran - Shape of You",
  "Taylor Swift - Love Story",
  "Lady Gaga - Bad Romance",
  "Ariana Grande - 7 Rings",
];

const tabContent = {
  "": <></>,
  spotify: <SpotifyTable />,
  trending: <TrendingTable />,
  history: <HistoryTable />,
  wishlist: <WishlistTable />,
};

export const Home: NextPage = () => {
  const router = useRouter();
  const [searchTab, setSearchTab] = useState<Tab | "">("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const { t } = useTranslation("");

  useEffect(() => {
    const rndPlaceholderIndex = Math.floor(Math.random() * placeholderValues.length);
    const rndPlaceholder = placeholderValues[rndPlaceholderIndex];
    setCurrentPlaceholder(rndPlaceholder!);
  }, []);

  const setTab = (newTab: Tab) => {
    if (newTab === searchTab) setSearchTab("");
    else setSearchTab(newTab);
  };

  const startSearch = (songId: string) => {
    // Get id from modal before pushing
    router.push(`/results?id=${songId}`);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    promptSongConfirmation();
  };

  const promptSongConfirmation = async () => {
    // Query itunes api

    console.log("hi");
  };

  const debouncedPromptSongConfirmation = useCallback(
    debounce(() => promptSongConfirmation(), 600),
    [], // dependencies of the useCallback hook
  );
  const handleInputChange = (searchTerm: string) => {
    setSearchValue(searchTerm);
    debouncedPromptSongConfirmation.cancel();
    debouncedPromptSongConfirmation();
  };

  return (
    <div className="-mt-2 flex w-full flex-col items-center gap-4 md:w-2/3">
      <div className="w-full">
        <form
          className="relative mx-auto flex max-w-lg flex-col items-center"
          onSubmit={handleSearchSubmit}
        >
          <Input
            type="text"
            placeholder={currentPlaceholder}
            sizeVariant="lg"
            className="overflow-ellipsis border-2 border-primary pr-14 text-lg placeholder:text-muted-foreground focus-visible:ring-primary"
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <button
            className="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2"
            type="submit"
          >
            <Search />
          </button>
        </form>
      </div>
      <div className="flex min-w-0 flex-wrap justify-center gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setTab(tab)}
            className={cn(
              "whitespace-nowrap transition-colors hover:text-foreground",
              searchTab === tab ? "font-bold text-foreground" : "text-muted-foreground",
            )}
          >
            {t(`search.tabs.${tab}`)}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={searchTab}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="hide-scrollbars mx-auto h-96 w-4/5 overflow-hidden rounded-xl p-4"
        >
          <Table>{tabContent[searchTab]}</Table>
        </motion.div>
      </AnimatePresence>
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
