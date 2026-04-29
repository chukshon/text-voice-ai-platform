"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGetVoiceById } from "@/services/voices/queries";
import LoadingState from "@/features/voices/my-voices/voice-details/loading-state";
import EmptyState from "@/features/voices/my-voices/voice-details/empty-state";

const VoiceDetailsPage = ({ params }: { params: Promise<{ voiceId: string }> }) => {
  const resolvedParams = React.use(params);
  const voiceId = resolvedParams.voiceId;

  const { data: voice, isLoading: isLoadingVoice } = useGetVoiceById(voiceId);

  if (isLoadingVoice) {
    return <LoadingState />;
  }
  if (!voice) {
    return <EmptyState />;
  }
  return <div>page</div>;
};

export default VoiceDetailsPage;
