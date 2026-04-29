"use client";
import React, { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import CreateVoiceDialog from "@/features/voices/my-voices/create-voice-dialog";
import { useGetVoices } from "@/services/voices/queries";
import Header from "@/features/voices/my-voices/header";
import VoicesList from "@/features/voices/my-voices/voices-list";

const VoicesPage = () => {
  const router = useRouter();
  const [showCreateVoiceDialog, setShowCreateVoiceDialog] = useState(false);
  const { data: voices, isLoading: loading } = useGetVoices();
  const handleOnCreated = (voiceId: string) => {
    router.push(`/voices/${voiceId}`);
  };
  return (
    <div className="p-8">
      {/* Header */}
      <Header handleCreateVoice={() => setShowCreateVoiceDialog(true)} />

      {/* Voice list */}
      <VoicesList
        voices={voices?.data}
        isLoading={loading}
        handleCreateVoice={() => setShowCreateVoiceDialog(true)}
      />

      <CreateVoiceDialog
        open={showCreateVoiceDialog}
        onOpenChange={setShowCreateVoiceDialog}
        onCreated={handleOnCreated}
      />
    </div>
  );
};

export default VoicesPage;
