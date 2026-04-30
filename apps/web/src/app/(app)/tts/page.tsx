"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VoicePicker from "@/features/tts/voice-picker";
import JobStatusDisplay from "@/features/tts/job-status-display";
import HistoryItem from "@/features/tts/job-status-display/job-history-item";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, History, Keyboard } from "lucide-react";
import { VoiceT } from "@/services/voices/types";
import { AudioFileInfoT, JobT } from "@/services/tts/types";
import { useGetTTSJobById, useGetTTSJobs } from "@/services/tts/queries";
import { useGetVoices } from "@/services/voices/queries";
import { ALLOWED_OUTPUT_ENUM, JobStatus } from "@/constants/tts";
import { useCreateTTSJobMutation } from "@/services/tts/mutations";
import TopToolbar from "@/features/tts/top-toolbar";
import EditorBody from "@/features/tts/editor-body";
import BottomBar from "@/features/tts/bottom-bar";
import HistorySidebar from "@/features/tts/history-sidebar";

const MAX_CHARS = 5000;
const TTSPage = () => {
  const [voice, setVoice] = useState<VoiceT | null>(null);
  const [text, setText] = useState("");
  const [outputFormat, setOutputFormat] = useState<
    ALLOWED_OUTPUT_ENUM.MP3 | ALLOWED_OUTPUT_ENUM.WAV
  >(ALLOWED_OUTPUT_ENUM.MP3);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Job tracking
  const [currentJob, setCurrentJob] = useState<JobT | null>(null);
  const [currentAudioFile, setCurrentAudioFile] = useState<AudioFileInfoT | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // History
  const [history, setHistory] = useState<JobT[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const historyLoadedRef = useRef(false);

  const { data: ttsJobs, isLoading: isLoadingTTSJobs } = useGetTTSJobs();
  const { data: ttsJob, isLoading: isLoadingTTSJob } = useGetTTSJobById(currentJob?.id || "");
  const { mutate: createTTSJobMutation } = useCreateTTSJobMutation();

  // Load history on mount
  useEffect(() => {
    if (historyLoadedRef.current) return;
    historyLoadedRef.current = true;

    const loadHistory = async () => {
      const lastCompleted = ttsJobs?.data?.find((j) => j.job.status === JobStatus.COMPLETED);
      if (lastCompleted && !currentJob) {
        loadJobDetails(lastCompleted.job.id);
      }
    };
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ttsJobs]);

  const loadJobDetails = useCallback(
    async (jobId: string) => {
      if (ttsJob?.success && ttsJob?.data) {
        setCurrentJob(ttsJob.data.job);
        setCurrentAudioFile(ttsJob.data.audioFile);
        setDownloadUrl(ttsJob.data.downloadUrl);
      }
    },
    [ttsJob],
  );

  const pollJob = useCallback(
    async (jobId: string) => {
      if (ttsJob?.success && ttsJob?.data) {
        setCurrentJob(ttsJob.data.job);
        setCurrentAudioFile(ttsJob.data.audioFile);
        setDownloadUrl(ttsJob.data.downloadUrl);

        if (
          ttsJob.data.job.status === JobStatus.COMPLETED ||
          ttsJob.data.job.status === JobStatus.FAILED
        ) {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          setHistory((prev) => [ttsJob.data?.job, ...prev.filter((j) => j.id !== jobId)] as JobT[]);
        }
      }
    },
    [ttsJob],
  );

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(200, el.scrollHeight)}px`;
  }, [text]);

  const isActive =
    currentJob &&
    (currentJob.status === JobStatus.PENDING || currentJob.status === JobStatus.PROCESSING);

  const handleSubmit = async () => {
    if (!voice || !text.trim() || isActive) return;

    setCurrentJob(null);
    setCurrentAudioFile(null);
    setDownloadUrl(null);

    createTTSJobMutation(
      {
        voiceId: voice.id,
        text: text.trim(),
        outputFormat,
      },
      {
        onSuccess: (data) => {
          setCurrentJob(data.data?.job as JobT);
        },
      },
    );

    pollRef.current = setInterval(() => pollJob(ttsJobs?.data?.[0]?.job.id || ""), 1500);
  };

  const handleHistoryClick = useCallback(
    (job: JobT) => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }

      if (job.status === JobStatus.PENDING || job.status === JobStatus.PROCESSING) {
        setCurrentJob(job);
        setCurrentAudioFile(null);
        setDownloadUrl(null);
        pollRef.current = setInterval(() => pollJob(job.id), 1500);
      } else {
        loadJobDetails(job.id);
      }

      if (job.inputText) {
        setText(job.inputText);
      }
    },
    [pollJob, loadJobDetails],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charPercent = (text.length / MAX_CHARS) * 100;

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* Main editor area */}
      <div className="flex flex-1 flex-col">
        {/* Top toolbar */}
        <TopToolbar
          voice={voice}
          setVoice={setVoice}
          format={outputFormat}
          setFormat={setOutputFormat}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
        />

        {/* Editor body */}
        <EditorBody
          textareaRef={textareaRef}
          text={text}
          setText={setText}
          handleKeyDown={handleKeyDown}
          currentJob={currentJob}
          error={currentJob?.error || null}
          currentAudioFile={currentAudioFile}
          downloadUrl={downloadUrl}
        />

        {/* Bottom bar */}
        <BottomBar
          voice={voice}
          text={text}
          setText={setText}
          handleSubmit={handleSubmit}
          submitting={isActive as boolean}
          isActive={isActive as boolean}
        />
      </div>

      {/* History sidebar */}
      <HistorySidebar
        history={history}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        currentJob={currentJob}
        handleHistoryClick={handleHistoryClick}
      />
    </div>
  );
};

export default TTSPage;
