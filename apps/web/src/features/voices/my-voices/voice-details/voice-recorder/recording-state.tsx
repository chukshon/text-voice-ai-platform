import React from "react";
import { motion } from "framer-motion";
import { formatTime } from "@/lib/utils/voice";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";
import LiveWaveForm from "./live-wave-form";

interface RecordingStateProps {
  elapsedMs: number;
  analyserNode: AnalyserNode | null;
  onStop: () => void;
}

const RecordingState = ({ elapsedMs, analyserNode, onStop }: RecordingStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b from-foreground/[0.02] to-transparent"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
        </span>
        <span className="text-xs font-semibold tracking-wide text-red-500/80">REC</span>
        <span className="text-sm font-medium tabular-nums text-foreground/80">
          {formatTime(elapsedMs)}
        </span>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="outline"
          onClick={onStop}
          className="gap-1.5 border-border/50 text-xs"
        >
          <Square className="size-3 fill-current" />
          Stop
        </Button>
      </div>

      {/* Live waveform canvas */}
      <div className="px-4 pb-3">
        <LiveWaveForm analyserNode={analyserNode} />
      </div>
    </motion.div>
  );
};

export default RecordingState;
