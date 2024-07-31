import { LoadingIndicator } from "@/components/Indicators";
import HistoryTable from "@/components/interactive/SongTables/HistoryTable";
import SpotifyTable from "@/components/interactive/SongTables/SpotifyTable";
import TrendingTable from "@/components/interactive/SongTables/TrendingTable";
import WishlistTable from "@/components/interactive/SongTables/WishlistTable";
import { Input } from "@/components/ui/input";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import type { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import nextI18nConfig from "../../next-i18next.config.mjs";
const SearchSettings = dynamic(() => import("@/components/interactive/SearchSettings"), {
  ssr: false,
});

const tabs = ["trending", "spotify", "history", "wishlist"] as const;
export type Tab = (typeof tabs)[number];
const isTab = (tab: string): tab is Tab => tabs.includes(tab as Tab);

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

export const Home: NextPage = () => {
  const router = useRouterWithHelpers();
  const { status } = useSession();
  const [searchTab, setSearchTab] = useState<Tab | "">("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const tableContent = {
    "": <></>,
    spotify: <SpotifyTable />,
    trending: <TrendingTable setSearchTab={setSearchTab} />,
    history: <HistoryTable />,
    wishlist: <WishlistTable />,
  };

  const { t } = useTranslation("");

  const loggedIn = status === "authenticated";

  useEffect(() => {
    const rndPlaceholderIndex = Math.floor(Math.random() * placeholderValues.length);
    const rndPlaceholder = placeholderValues[rndPlaceholderIndex];
    setCurrentPlaceholder(rndPlaceholder!);
  }, []);

  const setTab = (newTab: Tab) => {
    if (newTab === searchTab) {
      setSearchTab("");
      router.setParams({ search: "" });
    } else {
      setSearchTab(newTab);
      router.setParams({ search: newTab });
    }
  };

  useEffect(() => {
    const searchParam = router.getParams("search");
    if (router.isReady && searchParam && isTab(searchParam)) {
      setSearchTab(searchParam);
    } else {
      setSearchTab("");
    }
  }, [router.isReady]);

  const startSearch = (songId: string) => {
    // Get id from modal before pushing
    router.push(`/results?id=${songId}`);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    displaySongMatches();
  };

  const displaySongMatches = async () => {
    setIsLoading(true);
    // Query itunes api
    console.log("hiii");
    // Simulate 3s timeout
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const debouncedDisplaySongMatches = useCallback(
    debounce(() => displaySongMatches(), 600),
    [], // dependencies of the useCallback hook
  );

  const handleInputChange = (searchTerm: string) => {
    setSearchValue(searchTerm);
    debouncedDisplaySongMatches.cancel();
    debouncedDisplaySongMatches();
  };

  return (
    <div className="-mt-2 flex w-full max-w-4xl flex-col items-center gap-4">
      <div className="w-full">
        <form
          className="relative mx-auto flex max-w-xl flex-col items-center"
          onSubmit={handleSearchSubmit}
        >
          <Input
            type="text"
            placeholder={currentPlaceholder}
            sizeVariant="lg"
            className="overflow-ellipsis border-2 border-primary pl-14 pr-14 text-lg placeholder:text-muted-foreground focus-visible:ring-primary"
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <button
            className="absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2"
            type="submit"
          >
            {isLoading && (
              <AnimatePresence>
                <motion.div
                  className="flex h-8 justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingIndicator size={20} />
                </motion.div>
              </AnimatePresence>
            )}
            {!isLoading && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Search />
                </motion.div>
              </AnimatePresence>
            )}
          </button>
          <div className="absolute right-0 top-1/2 flex -translate-x-1/2 -translate-y-1/2 justify-center pr-2">
            <SearchSettings />
          </div>
        </form>
      </div>
      <div className="flex min-w-0 flex-wrap justify-center gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setTab(tab)}
            className={cn(
              "whitespace-nowrap transition-all hover:text-foreground",
              searchTab === tab ? "font-bold text-foreground" : "text-muted-foreground",
            )}
          >
            {t(`search.tabs.${tab}.header`)}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {searchTab !== "" && (
          <motion.div
            initial={{ height: "0rem" }}
            animate={{ height: "16rem" }}
            exit={{ height: "0rem" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mt-4 h-full w-full resize-y overflow-hidden rounded-3xl border-[1px] border-foreground/30 bg-primary/10 md:w-4/5 "
          >
            <motion.div
              initial={{ opacity: loggedIn ? 0 : 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: loggedIn ? 0 : 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              key={searchTab}
              className={cn("relative mx-auto flex h-full w-full flex-col items-center")}
            >
              {tableContent[searchTab]}
            </motion.div>
          </motion.div>
        )}
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
