import React from "react";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type WaveFormSectionProps = {
  ready: boolean;
  error: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  playing: boolean;
};
const WaveFormSection = ({ ready, error, containerRef, playing }: WaveFormSectionProps) => {
  return (
    <div className="relative px-4 pt-4 pb-1">
      <AnimatePresence>
        {!ready && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center rounded-t-xl bg-background/80 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2.5 text-muted-foreground/50">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-xs font-medium">Loading waveform...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef} className="relative cursor-pointer" style={{ minHeight: 64 }} />

      {/* Live playback indicator */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute right-5 top-5 flex items-center gap-1.5"
          >
            <div className="flex items-end gap-[2px]">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-[2.5px] rounded-full bg-indigo-500/60"
                  animate={{ height: ["4px", "14px", "4px"] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaveFormSection;
