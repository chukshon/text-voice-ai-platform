import React, { useCallback } from "react";
import { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { motion } from "framer-motion";

import { SPEEDS } from "@/constants/tts";

import ControlSection from "./control-section";
import FileInfo from "./file-info";
import WaveFormSection from "./wave-form-section";

type AudioPlayerProps = {
  src: string;
  fileName: string;
  durationMs: number | null;
  sizeBytes: number;
  mimeType: string;
};
const AudioPlayer = ({ src, fileName, durationMs, sizeBytes, mimeType }: AudioPlayerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WaveSurfer | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationMs ? durationMs / 1000 : 0);
  const [volume, setVolume] = useState(0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [speedIdx, setSpeedIdx] = useState(2); // index 2 = 1x
  const [error, setError] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const volumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 64,
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
      ws.setVolume(volume);
    });

    ws.on("timeupdate", (time) => {
      if (!cancelled) setCurrentTime(time);
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
      setError(true);
      setPlaying(false);
    });

    ws.load(src);
    wsRef.current = ws;

    return () => {
      cancelled = true;
      wsRef.current = null;
      try {
        ws.destroy();
      } catch {
        /* already destroyed */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const togglePlay = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || !ready) return;
    if (ws.getDuration() > 0 && ws.getCurrentTime() >= ws.getDuration()) {
      ws.seekTo(0);
    }
    ws.playPause();
  }, [ready]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (v > 0) setPrevVolume(v);
    wsRef.current?.setVolume(v);
  }, []);

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
      wsRef.current?.setVolume(0);
    } else {
      setVolume(prevVolume);
      wsRef.current?.setVolume(prevVolume);
    }
  }, [volume, prevVolume]);

  const handleVolumeMouseEnter = useCallback(() => {
    if (volumeTimeout.current) clearTimeout(volumeTimeout.current);
    setShowVolume(true);
  }, []);

  const handleVolumeMouseLeave = useCallback(() => {
    volumeTimeout.current = setTimeout(() => setShowVolume(false), 400);
  }, []);

  const cycleSpeed = useCallback(() => {
    const nextIdx = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(nextIdx);
    wsRef.current?.setPlaybackRate(SPEEDS[nextIdx]);
  }, [speedIdx]);

  const handleDownload = useCallback(() => {
    const a = document.createElement("a");
    a.href = src;
    a.download = fileName || "audio";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [src, fileName]);

  const ended = !playing && currentTime > 0 && duration > 0 && currentTime >= duration - 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b from-foreground/[0.02] to-transparent"
    >
      {/* Waveform area */}
      <WaveFormSection ready={ready} error={error} containerRef={containerRef} playing={playing} />

      <ControlSection
        ready={ready}
        error={error}
        playing={playing}
        volume={volume}
        ended={ended}
        currentTime={currentTime}
        duration={duration}
        speedIdx={speedIdx}
        showVolume={showVolume}
        togglePlay={togglePlay}
        cycleSpeed={cycleSpeed}
        toggleMute={toggleMute}
        handleVolumeMouseEnter={handleVolumeMouseEnter}
        handleVolumeMouseLeave={handleVolumeMouseLeave}
        handleVolumeChange={handleVolumeChange}
        handleDownload={handleDownload}
      />

      {(fileName || sizeBytes || mimeType) && (
        <FileInfo fileName={fileName} sizeBytes={sizeBytes} mimeType={mimeType} />
      )}
    </motion.div>
  );
};

export default AudioPlayer;
