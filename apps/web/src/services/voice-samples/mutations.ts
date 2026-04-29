import {
  CreateVoiceSampleResponseT,
  DeleteVoiceSamplePayloadT,
  DeleteVoiceSampleResponseT,
} from "./types";
import { CreateVoiceSamplePayloadT } from "@/schema/voice-sample.schema";
import { createVoiceSampleRequest, deleteVoiceSampleRequest } from "./requests";
import { ApiErrorResponseT } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";

export const useCreateVoiceSampleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateVoiceSampleResponseT, ApiErrorResponseT, CreateVoiceSamplePayloadT>({
    mutationFn: createVoiceSampleRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["voice-samples"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteVoiceSampleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteVoiceSampleResponseT, ApiErrorResponseT, DeleteVoiceSamplePayloadT>({
    mutationFn: deleteVoiceSampleRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["voice-samples"] });
    },
  });
};
