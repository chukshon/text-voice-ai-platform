"use client";
import { useState } from "react";
import { useGetLibrary } from "@/services/voices/queries";
import { GetLibraryQueryT } from "@/schema/voices.schema";
import { useDebounce } from "@/hooks/use-debounce";
import Header from "@/features/voices/library/header";
import LibraryListFilter from "@/features/voices/library/library-list-filter";
import VoicesGrid from "@/features/voices/library/voices-grid";

const VoicesLibraryPage = () => {
  const [query, setQuery] = useState<GetLibraryQueryT>({
    searchKeyword: useDebounce("", 500),
    language: "",
    category: undefined,
    gender: undefined,
    pageNumber: 1,
    limit: 10,
  });

  const debouncedQuery = useDebounce(query?.searchKeyword as string, 1000);

  const {
    data: libraryData,
    isLoading: isLoadingLibrary,
    error: errorLibrary,
  } = useGetLibrary({ ...query, searchKeyword: debouncedQuery });

  const handleQueryChange = (key: keyof GetLibraryQueryT, value: string | undefined) => {
    setQuery({ ...query, [key]: value });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <Header totalCount={libraryData?.data?.pagination?.totalCount as number} />

      {/* Filters */}
      <LibraryListFilter query={query} handleQueryChange={handleQueryChange} />

      {/* Voices Grid */}
      <VoicesGrid isLoading={isLoadingLibrary} voices={libraryData?.data?.data} />
    </div>
  );
};

export default VoicesLibraryPage;
