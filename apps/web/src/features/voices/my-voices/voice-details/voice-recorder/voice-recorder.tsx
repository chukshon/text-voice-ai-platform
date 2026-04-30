"use client";

import { useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { VoiceRecordingStateEnum } from "@/constants/voice";
import { useCreateVoiceSampleMutation } from "@/services/voice-samples/mutations";
import { VoiceSampleT } from "@/services/voice-samples/types";
import ErrorState from "./error-state";
import IdleState from "./idle-state";
import RequestingState from "./requesting-state";
import RecordingState from "./recording-state";
import RecordedState from "./recorded-state";

interface VoiceRecorderProps {
  voiceId: string;
  onUploaded: (sample: VoiceSampleT) => void;
}

export function VoiceRecorder({ voiceId, onUploaded }: VoiceRecorderProps) {
  const { mutate: createVoiceSample, isPending: isUploadingVoiceSample } =
    useCreateVoiceSampleMutation();
  const {
    recorderState,
    audioBlob,
    elapsedMs,
    analyserNode,
    error,
    startRecording,
    stopRecording,
    discard,
  } = useVoiceRecorder();

  const handleUse = useCallback(async () => {
    if (!audioBlob) return;

    const file = new File([audioBlob], `recording-${Date.now()}.wav`, {
      type: "audio/wav",
    });

    createVoiceSample(
      { file, voiceId },
      {
        onSuccess: (data) => {
          onUploaded(data?.data as VoiceSampleT);
          discard();
        },
      },
    );
  }, [audioBlob, voiceId, onUploaded, discard]);

  return (
    <AnimatePresence mode="wait">
      {error && (
        <ErrorState key="error" message={error} onRetry={startRecording} onDismiss={discard} />
      )}

      {!error && recorderState === VoiceRecordingStateEnum.IDLE && (
        <IdleState key="idle" onRecord={startRecording} />
      )}

      {recorderState === VoiceRecordingStateEnum.REQUESTING && <RequestingState key="requesting" />}

      {recorderState === VoiceRecordingStateEnum.RECORDING && (
        <RecordingState
          key="recording"
          elapsedMs={elapsedMs}
          analyserNode={analyserNode}
          onStop={stopRecording}
        />
      )}

      {recorderState === VoiceRecordingStateEnum.RECORDED && audioBlob && (
        <RecordedState
          key="recorded"
          audioBlob={audioBlob}
          elapsedMs={elapsedMs}
          onDiscard={discard}
          onReRecord={startRecording}
          onUse={handleUse}
          uploading={isUploadingVoiceSample}
        />
      )}
    </AnimatePresence>
  );
}
