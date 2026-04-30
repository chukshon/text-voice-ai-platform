import {
  CreateVoiceResponseT,
  DeleteVoiceResponseT,
  UpdateVoiceResponseT,
} from "@/services/voices/types";
import { CreateVoicePayloadT, UpdateVoicePayloadT } from "@/schema/voices.schema";
import {
  createVoiceRequest,
  deleteVoiceRequest,
  updateVoiceRequest,
} from "@/services/voices/requests";
import { ApiErrorResponseT } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";

export const useCreateVoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateVoiceResponseT, ApiErrorResponseT, CreateVoicePayloadT>({
    mutationFn: createVoiceRequest,
    onSuccess: (data) => {
      toast.success("Voice created successfully");
      queryClient.invalidateQueries({ queryKey: ["get-voices"] });
      queryClient.invalidateQueries({ queryKey: ["get-library"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateVoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<UpdateVoiceResponseT, ApiErrorResponseT, UpdateVoicePayloadT>({
    mutationFn: updateVoiceRequest,
    onSuccess: (data) => {
      toast.success("Voice updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get-voices"] });
      queryClient.invalidateQueries({ queryKey: ["get-voice-by-id"] });
      queryClient.invalidateQueries({ queryKey: ["get-library"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteVoiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteVoiceResponseT, ApiErrorResponseT, string>({
    mutationFn: deleteVoiceRequest,
    onSuccess: (data) => {
      toast.success("Voice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["get-voices"] });
      queryClient.invalidateQueries({ queryKey: ["get-library"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
