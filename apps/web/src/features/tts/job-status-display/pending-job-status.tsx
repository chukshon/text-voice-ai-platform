import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { JobStatus } from "@/constants/tts";

interface PendingJobStatusProps {
  status: JobStatus;
}
const PendingJobStatus = ({ status }: PendingJobStatusProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-lg border border-border/30 bg-foreground/[0.02] px-4 py-3"
    >
      <div className="relative flex size-8 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-foreground/5" />
        <Loader2 className="size-4 animate-spin text-foreground/60" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">
          {status === JobStatus.PENDING ? "Queued" : "Generating audio..."}
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground/40">
          {status === JobStatus.PENDING
            ? "Waiting in queue"
            : "Processing your text — this may take a moment"}
        </div>
      </div>

      {/* Processing animation bars */}
      <div className="flex items-end gap-[2px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-foreground/30"
            animate={{ height: ["8px", "20px", "8px"] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.12,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PendingJobStatus;
