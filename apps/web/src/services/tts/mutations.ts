import { ApiErrorResponseT } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import { CreateTTSJobPayloadT } from "@/schema/tts.schema";
import { CreateTTSJobResponseT } from "./types";
import { createTTSJobRequest } from "./requests";

export const useCreateTTSJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateTTSJobResponseT, ApiErrorResponseT, CreateTTSJobPayloadT>({
    mutationFn: createTTSJobRequest,
    onSuccess: (data) => {
      toast.success("TTS job created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-tts-jobs"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
