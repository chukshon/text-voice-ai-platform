import React from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

interface FailedJobStatusProps {
  error: string | null;
}
const FailedJobStatus = ({ error }: FailedJobStatusProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/[0.04] px-4 py-3"
    >
      <XCircle className="size-5 shrink-0 text-destructive/70" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-destructive/90">Generation failed</div>
        {error && <div className="mt-0.5 truncate text-[11px] text-destructive/50">{error}</div>}
      </div>
    </motion.div>
  );
};

export default FailedJobStatus;
