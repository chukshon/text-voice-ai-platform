import { CreateVoiceResponseT } from "@/services/voices/types";
import { CreateVoicePayloadT } from "@/schema/voices.schema";
import { createVoiceRequest } from "@/services/voices/requests";
import { ApiErrorResponseT } from "@/types/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useCreateVoiceMutation = () => {
  return useMutation<CreateVoiceResponseT, ApiErrorResponseT, CreateVoicePayloadT>({
    mutationFn: createVoiceRequest,
    onSuccess: (data) => {},
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
