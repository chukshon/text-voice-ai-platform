import { CreateVoiceResponseT } from "@/services/voices/types";
import { CreateVoicePayloadT } from "@/schema/voices.schema";
import { createVoiceRequest } from "@/services/voices/requests";
import { ApiErrorResponseT } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";

export const useCreateVoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateVoiceResponseT, ApiErrorResponseT, CreateVoicePayloadT>({
    mutationFn: createVoiceRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get-voices"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
