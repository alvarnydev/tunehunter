import { LoadingIndicator } from "@/components/Indicators";
import { Input } from "@/components/ui/input";
import useRouterWithHelpers from "@/hooks/useRouterWithHelpers";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { FC, FormEvent, useCallback, useEffect, useState } from "react";
const SearchSettings = dynamic(() => import("@/components/interactive/SearchSettings"), {
  ssr: false,
});

interface IProps {}

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

const SearchBar: FC<IProps> = ({}) => {
  const router = useRouterWithHelpers();
  const [searchValue, setSearchValue] = useState("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const rndPlaceholderIndex = Math.floor(Math.random() * placeholderValues.length);
    const rndPlaceholder = placeholderValues[rndPlaceholderIndex];
    setCurrentPlaceholder(rndPlaceholder!);
  }, []);

  const startSearch = (songId: string) => {
    // Get id from modal before pushing
    router.push(`/results?id=${songId}`);
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

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    displaySongMatches();
  };

  const handleInputChange = (searchTerm: string) => {
    setSearchValue(searchTerm);
    debouncedDisplaySongMatches.cancel();
    debouncedDisplaySongMatches();
  };

  return (
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
        <button className="absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2" type="submit">
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
  );
};

export default SearchBar;
