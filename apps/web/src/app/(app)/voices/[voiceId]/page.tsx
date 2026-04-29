"use client";
import React, { useState } from "react";
import { useGetVoiceById } from "@/services/voices/queries";
import LoadingState from "@/features/voices/my-voices/voice-details/loading-state";
import EmptyState from "@/features/voices/my-voices/voice-details/empty-state";
import Header from "@/features/voices/my-voices/voice-details/header";
import { useRouter } from "nextjs-toploader/app";
import { ROUTES } from "@/constants";
import { ArrowLeft } from "lucide-react";
import VoiceDetailsTab from "@/features/voices/my-voices/voice-details/voice-details-tab";
import DeleteVoiceDialog from "@/features/voices/my-voices/voice-details/delete-voice-dialog";
import { useDeleteVoiceMutation } from "@/services/voices/mutations";

const VoiceDetailsPage = ({ params }: { params: Promise<{ voiceId: string }> }) => {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const voiceId = resolvedParams.voiceId;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: voice, isLoading: isLoadingVoice } = useGetVoiceById(voiceId);
  const { mutate: deleteVoice, isPending: isDeletingVoice } = useDeleteVoiceMutation();

  const handleDeleteVoice = () => {
    deleteVoice(voiceId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        router.push(ROUTES.VOICES);
      },
    });
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
        handleShowDeleteDialog={() => setShowDeleteDialog(true)}
      />

      {/* Tabs */}
      <VoiceDetailsTab voice={voice.data} />

      <DeleteVoiceDialog
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        voiceName={voice.data?.name as string}
        handleDeleteVoice={handleDeleteVoice}
        isDeletingVoice={isDeletingVoice}
      />
    </div>
  );
};

export default VoiceDetailsPage;
