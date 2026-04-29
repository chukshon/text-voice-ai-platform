"use client";
import React, { useState } from "react";
import { useGetVoiceById } from "@/services/voices/queries";
import LoadingState from "@/features/voices/my-voices/voice-details/loading-state";
import EmptyState from "@/features/voices/my-voices/voice-details/empty-state";
import Header from "@/features/voices/my-voices/voice-details/header";
import { useRouter } from "nextjs-toploader/app";
import { ROUTES } from "@/constants";
import { ArrowLeft } from "lucide-react";

const VoiceDetailsPage = ({ params }: { params: Promise<{ voiceId: string }> }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const voiceId = resolvedParams.voiceId;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: voice, isLoading: isLoadingVoice } = useGetVoiceById(voiceId);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleBackToVoices = () => {
    router.push(ROUTES.VOICES);
  };

  if (isLoadingVoice) {
    return <LoadingState />;
  }
  if (!voice) {
    return <EmptyState />;
  }

  return (
    <div className="p-8">
      {/* Back link */}
      <button
        onClick={handleBackToVoices}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        My Voices
      </button>

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
