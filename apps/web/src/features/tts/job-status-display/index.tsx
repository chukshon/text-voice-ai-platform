import { motion } from "framer-motion";
import { XCircle, Loader2, CheckCircle2 } from "lucide-react";
import { JobStatus } from "@/constants/tts";

import AudioPlayer from "@/features/tts/audio-player";

interface AudioFileInfo {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  durationMs: number | null;
}

interface JobStatusProps {
  status: JobStatus;
  error: string | null;
  audioFile: AudioFileInfo | null;
  downloadUrl: string | null;
}
const JobStatusDisplay = ({ status, error, audioFile, downloadUrl }: JobStatusProps) => {
  if (status === JobStatus.PENDING || status === JobStatus.PROCESSING) {
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
  }

  if (status === JobStatus.FAILED) {
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
  }

  if (downloadUrl && audioFile) {
    return (
      <AudioPlayer
        src={downloadUrl}
        durationMs={audioFile.durationMs}
        fileName={audioFile.fileName}
        sizeBytes={audioFile.sizeBytes}
        mimeType={audioFile.mimeType}
      />
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-lg border border-border/30 bg-foreground/[0.02] px-4 py-3"
    >
      <CheckCircle2 className="size-5 shrink-0 text-emerald-500/60" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">Audio generated</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground/40">Loading audio player...</div>
      </div>
    </motion.div>
  );
};

export default JobStatusDisplay;
