import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import JobStatusDisplay from "./job-status-display";
import { AudioFileInfoT, JobT } from "@/services/tts/types";

interface EditorBodyProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  text: string;
  setText: (text: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  currentJob: JobT | null;
  error: string | null;
  currentAudioFile: AudioFileInfoT | null;
  downloadUrl: string | null;
}
const EditorBody = ({
  textareaRef,
  text,
  setText,
  handleKeyDown,
  currentJob,
  error,
  currentAudioFile,
  downloadUrl,
}: EditorBodyProps) => {
  const MAX_CHARS = 5000;
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder="Start typing or paste the text you want to convert to speech..."
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground/20"
            style={{ minHeight: "200px" }}
          />
        </div>

        {/* Status / Result */}
        <AnimatePresence mode="wait">
          {(currentJob || error) && (
            <motion.div
              key={currentJob?.id || "error"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6"
            >
              {error ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/[0.04] px-4 py-3 text-sm text-destructive/80">
                  {error}
                </div>
              ) : currentJob ? (
                <JobStatusDisplay
                  status={currentJob.status}
                  error={currentJob.error}
                  audioFile={currentAudioFile}
                  downloadUrl={downloadUrl}
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EditorBody;
