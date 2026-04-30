import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Play, Pause, Trash2, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime, formatBytes } from "@/lib/utils/voice";

interface RecordedStateProps {
  audioBlob: Blob;
  elapsedMs: number;
  onDiscard: () => void;
  onReRecord: () => void;
  onUse: () => void;
  uploading: boolean;
}

const RecordedState = ({
  audioBlob,
  elapsedMs,
  onDiscard,
  onReRecord,
  onUse,
  uploading,
}: RecordedStateProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 48,
      barWidth: 2,
      barGap: 1.5,
      barRadius: 4,
      cursorWidth: 2,
      cursorColor: "rgba(99, 102, 241, 0.7)",
      waveColor: "rgba(148, 163, 184, 0.3)",
      progressColor: "rgba(99, 102, 241, 0.6)",
      normalize: true,
      backend: "WebAudio",
      dragToSeek: true,
      hideScrollbar: true,
      autoScroll: false,
      fillParent: true,
      minPxPerSec: 0,
    });

    ws.on("ready", () => {
      if (cancelled) return;
      setReady(true);
      setDuration(ws.getDuration());
    });
    ws.on("timeupdate", (t) => {
      if (!cancelled) setCurrentTime(t);
    });
    ws.on("play", () => {
      if (!cancelled) setPlaying(true);
    });
    ws.on("pause", () => {
      if (!cancelled) setPlaying(false);
    });
    ws.on("finish", () => {
      if (!cancelled) setPlaying(false);
    });
    ws.on("error", (err) => {
      if (cancelled || (err instanceof DOMException && err.name === "AbortError")) return;
    });

    const url = URL.createObjectURL(audioBlob);
    ws.load(url);
    wsRef.current = ws;

    return () => {
      cancelled = true;
      wsRef.current = null;
      URL.revokeObjectURL(url);
      try {
        ws.destroy();
      } catch {
        /* already destroyed */
      }
    };
  }, [audioBlob]);

  const togglePlay = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || !ready) return;
    if (ws.getCurrentTime() >= ws.getDuration()) ws.seekTo(0);
    ws.playPause();
  }, [ready]);

  const durationMs = duration * 1000 || elapsedMs;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b from-foreground/[0.02] to-transparent"
    >
      {/* Waveform */}
      <div className="relative px-4 pt-4 pb-1">
        <AnimatePresence>
          {!ready && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2.5 text-muted-foreground/50">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-xs font-medium">Processing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={containerRef} className="cursor-pointer" style={{ minHeight: 48 }} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 px-3 pb-2 pt-1">
        <button
          type="button"
          onClick={togglePlay}
          disabled={!ready}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
        >
          {playing ? <Pause className="size-3.5" /> : <Play className="ml-0.5 size-3.5" />}
        </button>
        <div className="ml-2 flex items-baseline gap-1 tabular-nums">
          <span className="text-sm font-medium">{formatTime(currentTime * 1000)}</span>
          <span className="text-[11px] text-muted-foreground/40">/</span>
          <span className="text-[11px] text-muted-foreground/40">{formatTime(durationMs)}</span>
        </div>
      </div>

      {/* Info strip */}
      <div className="flex items-center gap-2 border-t border-border/20 px-4 py-1.5">
        <span className="text-[11px] text-muted-foreground/40">WAV</span>
        <span className="text-[11px] text-muted-foreground/20">·</span>
        <span className="text-[11px] text-muted-foreground/40">{formatBytes(audioBlob.size)}</span>
        <span className="text-[11px] text-muted-foreground/20">·</span>
        <span className="text-[11px] text-muted-foreground/40">{formatTime(durationMs)}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 border-t border-border/20 px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDiscard}
          disabled={uploading}
          className="gap-1.5 text-xs text-muted-foreground/60"
        >
          <Trash2 className="size-3" />
          Discard
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReRecord}
          disabled={uploading}
          className="gap-1.5 border-border/50 text-xs"
        >
          <RotateCcw className="size-3" />
          Re-record
        </Button>
        <div className="flex-1" />
        <Button size="sm" onClick={onUse} disabled={uploading} className="gap-1.5 text-xs">
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Mic className="size-3.5" />}
          {uploading ? "Uploading..." : "Use this recording"}
        </Button>
      </div>
    </motion.div>
  );
};

export default RecordedState;
