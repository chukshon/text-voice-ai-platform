import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateVoiceForm from "./create-voice-form";
import { useRouter } from "nextjs-toploader/app";
import { useCreateVoiceMutation } from "@/services/voices/mutations";
import { CreateVoiceInputT } from "@/schema/voices.schema";
import { VoiceT } from "@/services/voices/types";

interface CreateVoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (voice: VoiceT) => void;
}

const CreateVoiceDialog = ({ open, onOpenChange }: CreateVoiceDialogProps) => {
  const {
    mutate: createVoiceMutation,
    isPending: loading,
    error: createVoiceError,
    isSuccess: isCreateVoiceSuccess,
  } = useCreateVoiceMutation();

  const handleOpenChange = (value: boolean) => {
    if (!value) handleReset();
    onOpenChange(value);
  };

  const handleReset = () => {};

  const handleSubmit = (data: CreateVoiceInputT) => {
    // createVoiceMutation(data);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create a voice</DialogTitle>
            <DialogDescription>Add a new custom voice to your collection.</DialogDescription>
          </DialogHeader>
          <CreateVoiceForm
            handleResetForm={handleReset}
            handleSubmit={handleSubmit}
            isCreateVoiceSuccess={isCreateVoiceSuccess}
            isCreateVoiceLoading={loading}
            createVoiceError={createVoiceError}
          />
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVoiceDialog;
