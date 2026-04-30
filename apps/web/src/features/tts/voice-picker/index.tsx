import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { GetLibraryQueryT } from "@/schema/voices.schema";
import { useGetLibrary } from "@/services/voices/queries";
import { useDebounce } from "@/hooks/use-debounce";
import { VoiceT } from "@/services/voices/types";

import PickerToggler from "./picker-toggler";
import Search from "./search";
import VoiceCard from "./voice-card";

interface VoicePickerProps {
  value?: VoiceT | null;
  onChange: (voice: VoiceT) => void;
}
const VoicePicker = ({ value, onChange }: VoicePickerProps) => {
  const [open, setOpen] = useState(false);
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

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => {
      setQuery({ ...query, searchKeyword: debouncedQuery });
    }, 250);
    return () => clearTimeout(timeout);
  }, [open, debouncedQuery]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={containerRef} className="relative">
      <PickerToggler isOpen={open} setOpen={setOpen} value={value} />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1.5 w-full overflow-hidden rounded-lg border border-border/50 bg-card shadow-xl shadow-black/20"
          >
            <Search
              inputRef={inputRef}
              search={query.searchKeyword}
              handleSearch={(search) => handleQueryChange("searchKeyword", search)}
            />

            <div className="max-h-[260px] overflow-y-auto py-1">
              {isLoadingLibrary && (
                <div className="flex items-center justify-center py-8">
                  <div className="size-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
                </div>
              )}

              {libraryData?.data?.data?.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground/40">
                  No voices found
                </div>
              )}

              {libraryData?.data?.data?.map((voice) => {
                const selected = value?.id === voice.id;
                return (
                  <VoiceCard
                    key={voice.id}
                    voice={voice}
                    onChange={onChange}
                    setOpen={setOpen}
                    handleSearch={(search) => handleQueryChange("searchKeyword", search)}
                    selected={selected}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoicePicker;
