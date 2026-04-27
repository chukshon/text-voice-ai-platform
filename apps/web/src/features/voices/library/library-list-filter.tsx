import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  VOICE_LANGUAGE_OPTIONS,
  VOICE_GENDER_OPTIONS,
  VOICE_CATEGORY_OPTIONS,
} from "@/constants/voice";
import { GetLibraryQueryT } from "@/schema/voices.schema";

interface LibraryListFilterProps {
  query: GetLibraryQueryT;
  handleQueryChange: (key: keyof GetLibraryQueryT, value: string | undefined) => void;
}
const LibraryListFilter = ({ query, handleQueryChange }: LibraryListFilterProps) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative max-w-xs flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search voices..."
          value={query.searchKeyword ?? ""}
          onChange={(e) => handleQueryChange("searchKeyword", e.target.value)}
          className="h-9 pl-9"
        />
      </div>

      <Select
        value={query.language}
        onValueChange={(v) => handleQueryChange("language", v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {VOICE_LANGUAGE_OPTIONS.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={query.gender}
        onValueChange={(v) => handleQueryChange("gender", v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-9 w-[120px]">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          {VOICE_GENDER_OPTIONS.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={query.category}
        onValueChange={(v) => handleQueryChange("category", v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {VOICE_CATEGORY_OPTIONS.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LibraryListFilter;
