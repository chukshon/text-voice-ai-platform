"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VoiceT } from "@/services/voices/types";
import { AudioFileInfoT, JobT } from "@/services/tts/types";
import { useGetTTSJobById, useGetTTSJobs } from "@/services/tts/queries";
import { ALLOWED_OUTPUT_ENUM, JobStatus } from "@/constants/tts";
import { useCreateTTSJobMutation } from "@/services/tts/mutations";
import TopToolbar from "@/features/tts/top-toolbar";
import EditorBody from "@/features/tts/editor-body";
import BottomBar from "@/features/tts/bottom-bar";
import HistorySidebar from "@/features/tts/history-sidebar";

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
  const prevJobSnapshotRef = useRef<{ id: string; status: JobStatus } | null>(null);

  // History
  const [history, setHistory] = useState<JobT[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const historyLoadedRef = useRef(false);

  const { data: ttsJobs } = useGetTTSJobs();

  const shouldPollJob =
    !!currentJob &&
    (currentJob.status === JobStatus.PENDING || currentJob.status === JobStatus.PROCESSING);

  const { data: ttsJob } = useGetTTSJobById(currentJob?.id ?? "", {
    refetchInterval: shouldPollJob ? 1500 : false,
  });
  const { mutate: createTTSJobMutation } = useCreateTTSJobMutation();

  const handleSubmit = async () => {
    if (!voice || !text.trim() || shouldPollJob) return;

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
          setCurrentJob(data.data as JobT);
        },
      },
    );
  };

  const handleHistoryClick = useCallback((job: JobT) => {
    setCurrentJob(job);
    setCurrentAudioFile(null);
    setDownloadUrl(null);

    if (job.inputText) {
      setText(job.inputText);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (historyLoadedRef.current) return;
    if (!ttsJobs?.success || !ttsJobs.data) return;

    const jobs = ttsJobs.data.data;
    if (!Array.isArray(jobs)) return;

    historyLoadedRef.current = true;
    setHistory(jobs);
  }, [ttsJobs]);

  useEffect(() => {
    if (!currentJob?.id) return;
    if (!ttsJob?.success || !ttsJob.data) return;
    if (ttsJob.data.job.id !== currentJob.id) return;

    setCurrentJob(ttsJob.data.job);
    setCurrentAudioFile(ttsJob.data.audioFile);
    setDownloadUrl(ttsJob.data.downloadUrl);
  }, [currentJob?.id, ttsJob]);

  useEffect(() => {
    if (!currentJob) {
      prevJobSnapshotRef.current = null;
      return;
    }

    const prev = prevJobSnapshotRef.current;
    prevJobSnapshotRef.current = { id: currentJob.id, status: currentJob.status };

    if (!prev || prev.id !== currentJob.id) return;

    const wasActive = prev.status === JobStatus.PENDING || prev.status === JobStatus.PROCESSING;
    const nowTerminal =
      currentJob.status === JobStatus.COMPLETED || currentJob.status === JobStatus.FAILED;

    if (wasActive && nowTerminal) {
      setHistory((prevList) => [currentJob, ...prevList.filter((j) => j.id !== currentJob.id)]);
    }
  }, [currentJob]);

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
