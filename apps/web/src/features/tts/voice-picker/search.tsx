import React from "react";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  inputRef: React.RefObject<HTMLInputElement>;
  search: string;
  setSearch: (search: string) => void;
}
const Search = ({ inputRef, search, setSearch }: SearchProps) => {
  return (
    <div className="border-b border-border/30 px-3 py-2">
      <div className="relative">
        <SearchIcon className="absolute left-0 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/30" />
        <input
          ref={inputRef}
          placeholder="Search voices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 w-full bg-transparent pl-5 text-sm outline-none placeholder:text-muted-foreground/30"
        />
      </div>
    </div>
  );
};

export default Search;
