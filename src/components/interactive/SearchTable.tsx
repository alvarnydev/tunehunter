import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { spotifyMockData } from "@/helpers/mock-spotify-data";
import { Button } from "../ui/button";
import { ReactNode } from "react";

interface SearchTableProps {
  children: ReactNode;
}

const SearchTable = ({ children }: SearchTableProps) => {
  return (
    <Table className="mx-auto h-96 overflow-hidden rounded-xl px-3 py-4 text-base shadow-md shadow-accent">
      {children}
    </Table>
  );
};

export default SearchTable;
