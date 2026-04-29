"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useGetVoiceById } from "@/services/voices/queries";
import LoadingState from "@/features/voices/my-voices/voice-details/loading-state";
import EmptyState from "@/features/voices/my-voices/voice-details/empty-state";
import Header from "@/features/voices/my-voices/voice-details/header";

const VoiceDetailsPage = ({ params }: { params: Promise<{ voiceId: string }> }) => {
  const resolvedParams = React.use(params);
  const voiceId = resolvedParams.voiceId;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: voice, isLoading: isLoadingVoice } = useGetVoiceById(voiceId);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  if (isLoadingVoice) {
    return <LoadingState />;
  }
  if (!voice) {
    return <EmptyState />;
  }

  return (
    <div>
      <Header
        voiceName={voice.data?.name}
        voiceCategory={voice.data?.category}
        voiceLanguage={voice.data?.language}
        voiceGender={voice.data?.gender}
        voiceAccent={voice.data?.accent}
        voiceIsPublic={voice.data?.isPublic}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default VoiceDetailsPage;
