import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateVoicePayloadT, createVoiceSchema } from "@/schema/voices.schema";
import { VoiceCategoryEnum, VoiceGenderEnum, VoiceLanguageEnum } from "@/constants/voice";
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
import { toast } from "react-hot-toast";

interface CreateVoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (voiceId: string) => void;
}

const CreateVoiceDialog = ({ open, onOpenChange, onCreated }: CreateVoiceDialogProps) => {
  const form = useForm<CreateVoicePayloadT>({
    resolver: zodResolver(createVoiceSchema),
    defaultValues: {
      name: "",
      category: VoiceCategoryEnum.CUSTOM,
      language: VoiceLanguageEnum.ENGLISH,
      gender: VoiceGenderEnum.FEMALE,
      isPublic: false,
      description: "",
      accent: "",
    },
  });

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

  const onSubmit = (data: CreateVoicePayloadT) => {
    createVoiceMutation(data, {
      onSuccess: (response) => {
        handleReset();
        onCreated(response.data?.id as string);
        handleOpenChange(false);
        toast.success("Voice created successfully");
      },
    });
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
