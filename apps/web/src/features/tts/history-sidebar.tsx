import { JobT } from "@/services/tts/types";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import HistoryItem from "./job-status-display/job-history-item";

interface HistorySidebarProps {
  history?: JobT[];
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
  currentJob: JobT | null;
  handleHistoryClick: (job: JobT) => void;
}
const HistorySidebar = ({
  history,
  showHistory,
  setShowHistory,
  currentJob,
  handleHistoryClick,
}: HistorySidebarProps) => {
  return (
    <AnimatePresence>
      {showHistory && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex shrink-0 flex-col overflow-hidden border-l border-border/30"
        >
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
            <span className="text-xs font-semibold">History</span>
            <span className="text-[10px] text-muted-foreground/30">{history?.length} jobs</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {history?.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground/30">No jobs yet</div>
            ) : (
              <div className="space-y-0.5">
                {history?.map((job) => (
                  <HistoryItem
                    key={job.id}
                    job={job}
                    isActive={currentJob?.id === job.id}
                    onClick={() => handleHistoryClick(job)}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default HistorySidebar;
