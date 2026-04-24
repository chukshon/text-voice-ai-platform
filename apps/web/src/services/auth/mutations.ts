import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/services/auth/requests";
import { LoginPayloadT, LoginResponseT } from "@/services/auth/types";
import { ApiErrorResponseT } from "@/types/api";
import { toast } from "react-hot-toast";

export const useLoginMutation = () => {
  return useMutation<LoginResponseT, ApiErrorResponseT, LoginPayloadT>({
    mutationFn: loginRequest,
    onSuccess: (data) => {},
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
