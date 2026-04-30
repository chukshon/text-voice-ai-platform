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
}

export function VoiceRecorder({ voiceId }: VoiceRecorderProps) {
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
          discard();
        },
      },
    );
  }, [audioBlob, voiceId, discard]);

  return (
    <AnimatePresence mode="wait">
      {error && (
        <ErrorState
          key={VoiceRecordingStateEnum.ERROR}
          message={error}
          onRetry={startRecording}
          onDismiss={discard}
        />
      )}

      {!error && recorderState === VoiceRecordingStateEnum.IDLE && (
        <IdleState key={VoiceRecordingStateEnum.IDLE} onRecord={startRecording} />
      )}

      {recorderState === VoiceRecordingStateEnum.REQUESTING && (
        <RequestingState key={VoiceRecordingStateEnum.REQUESTING} />
      )}

      {recorderState === VoiceRecordingStateEnum.RECORDING && (
        <RecordingState
          key={VoiceRecordingStateEnum.RECORDING}
          elapsedMs={elapsedMs}
          analyserNode={analyserNode}
          onStop={stopRecording}
        />
      )}

      {recorderState === VoiceRecordingStateEnum.RECORDED && audioBlob && (
        <RecordedState
          key={VoiceRecordingStateEnum.RECORDED}
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
