import React from "react";
import { Play, Pause, Download, RotateCcw, Gauge, VolumeX, Volume1, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { formatTime } from "@/lib/utils/voice";
import { SPEEDS } from "@/constants/tts";

type ControlSectionProps = {
  togglePlay: () => void;
  cycleSpeed: () => void;
  toggleMute: () => void;
  handleVolumeMouseEnter: () => void;
  handleVolumeMouseLeave: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
  volume: number;
  showVolume: boolean;
  error: boolean;
  ready: boolean;
  ended: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  speedIdx: number;
};
const ControlSection = ({
  error,
  ready,
  ended,
  playing,
  currentTime,
  duration,
  speedIdx,
  cycleSpeed,
  toggleMute,
  handleVolumeMouseEnter,
  handleVolumeMouseLeave,
  handleVolumeChange,
  handleDownload,
  togglePlay,
  volume,
  showVolume,
}: ControlSectionProps) => {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  return (
    <div className="flex items-center gap-1 px-3 pb-3 pt-1">
      <button
        type="button"
        onClick={togglePlay}
        disabled={error || !ready}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
        title={error ? "Failed to load" : ended ? "Replay" : playing ? "Pause" : "Play"}
      >
        {error ? (
          <RotateCcw className="size-4" />
        ) : ended ? (
          <RotateCcw className="size-4" />
        ) : playing ? (
          <Pause className="size-4" />
        ) : (
          <Play className="ml-0.5 size-4" />
        )}
      </button>

      <div className="ml-2 flex items-baseline gap-1 tabular-nums">
        <span className="text-sm font-medium">{formatTime(currentTime)}</span>
        <span className="text-[11px] text-muted-foreground/40">/</span>
        <span className="text-[11px] text-muted-foreground/40">{formatTime(duration)}</span>
      </div>

      <div className="flex-1" />

      {/* Speed control */}
      <button
        type="button"
        onClick={cycleSpeed}
        className="flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-muted-foreground/60 transition-colors hover:bg-foreground/[0.06] hover:text-muted-foreground"
        title="Playback speed"
      >
        <Gauge className="size-3" />
        {SPEEDS[speedIdx]}x
      </button>

      {/* Volume control */}
      <div
        className="relative flex items-center"
        onMouseEnter={handleVolumeMouseEnter}
        onMouseLeave={handleVolumeMouseLeave}
      >
        <button
          type="button"
          onClick={toggleMute}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground/50 transition-colors hover:bg-foreground/[0.06] hover:text-muted-foreground"
          title={volume === 0 ? "Unmute" : "Mute"}
        >
          <VolumeIcon className="size-3.5" />
        </button>

        <AnimatePresence>
          {showVolume && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 80, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="ml-1 h-1 w-[72px] cursor-pointer appearance-none rounded-full bg-foreground/10 accent-foreground/60"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Download */}
      <button
        type="button"
        onClick={handleDownload}
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:bg-foreground/[0.06] hover:text-muted-foreground"
        title="Download"
      >
        <Download className="size-3.5" />
      </button>
    </div>
  );
};

export default ControlSection;
