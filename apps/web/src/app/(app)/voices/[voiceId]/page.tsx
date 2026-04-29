"use client";
import React, { useState } from "react";
import { useGetVoiceById } from "@/services/voices/queries";
import LoadingState from "@/features/voices/my-voices/voice-details/loading-state";
import EmptyState from "@/features/voices/my-voices/voice-details/empty-state";
import Header from "@/features/voices/my-voices/voice-details/header";
import { useRouter } from "nextjs-toploader/app";
import { ROUTES } from "@/constants";
import VoiceDetailsTab from "@/features/voices/my-voices/voice-details/voice-details-tab";
import DeleteVoiceDialog from "@/features/voices/my-voices/voice-details/delete-voice-dialog";
import { useDeleteVoiceMutation } from "@/services/voices/mutations";
import BackButton from "@/features/voices/my-voices/voice-details/back-button";

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
      <BackButton handleBackToVoices={handleBackToVoices} />

      <Header voice={voice.data} handleShowDeleteDialog={() => setShowDeleteDialog(true)} />

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
