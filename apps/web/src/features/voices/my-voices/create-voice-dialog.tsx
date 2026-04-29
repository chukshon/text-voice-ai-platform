import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateVoiceInputT, createVoiceSchema } from "@/schema/voices.schema";
import { VoiceCategoryEnum, VoiceGenderEnum } from "@repo/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateVoiceForm from "./create-voice-form";
import { useCreateVoiceMutation } from "@/services/voices/mutations";
import { VoiceT } from "@/services/voices/types";

interface CreateVoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (voice: VoiceT) => void;
}

const CreateVoiceDialog = ({ open, onOpenChange }: CreateVoiceDialogProps) => {
  const form = useForm<CreateVoiceInputT>({
    resolver: zodResolver(createVoiceSchema),
    defaultValues: {
      name: "",
      category: VoiceCategoryEnum.CUSTOM,
      language: "en",
      gender: VoiceGenderEnum.FEMALE,
      isPublic: false,
      description: "",
      accent: "",
    },
  });

  function onSubmit(data: CreateVoiceInputT) {
    console.log("data", data);
  }
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

  const handleReset = () => {
    form.reset();
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
            onSubmit={onSubmit}
            form={form}
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
