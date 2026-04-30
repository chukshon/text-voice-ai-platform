import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { JobStatus } from "@/constants/tts";

import AudioPlayer from "@/features/tts/audio-player";
import FailedJobStatus from "./failed-job-status";
import PendingJobStatus from "./pending-job-status";

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
    return <PendingJobStatus status={status} />;
  }

  if (status === JobStatus.FAILED) {
    return <FailedJobStatus error={error} />;
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
