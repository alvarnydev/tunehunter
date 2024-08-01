import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { FC, useEffect, useState } from "react";
import HistoryTable from "../SongTables/HistoryTable";
import SpotifyTable from "../SongTables/SpotifyTable";
import TrendingTable from "../SongTables/TrendingTable";
import WishlistTable from "../SongTables/WishlistTable";

interface IProps {}

const tabs = ["trending", "spotify", "history", "wishlist"] as const;
export type Tab = (typeof tabs)[number];
const isTab = (tab: string): tab is Tab => tabs.includes(tab as Tab);

const SearchTabs: FC<IProps> = ({}) => {
  const { t } = useTranslation("");
  const { status } = useSession();
  const router = useRouterWithHelpers();
  const [searchTab, setSearchTab] = useState<Tab | "">("");
  const loggedIn = status === "authenticated";

  useEffect(() => {
    const searchParam = router.getParams("search");
    if (router.isReady && searchParam && isTab(searchParam)) {
      setSearchTab(searchParam);
    } else {
      setSearchTab("");
    }
  }, [router.isReady]);

  const tableContent = {
    "": <></>,
    spotify: <SpotifyTable />,
    trending: <TrendingTable setSearchTab={setSearchTab} />,
    history: <HistoryTable />,
    wishlist: <WishlistTable />,
  };

  const setTab = (newTab: Tab) => {
    if (newTab === searchTab) {
      setSearchTab("");
      router.setParams({ search: "" });
    } else {
      setSearchTab(newTab);
      router.setParams({ search: newTab });
    }
  };

  return (
    <>
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
    </>
  );
};

export default SearchTabs;
