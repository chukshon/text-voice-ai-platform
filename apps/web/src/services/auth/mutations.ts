import { useMutation } from "@tanstack/react-query";
import { loginRequest, registerRequest } from "@/services/auth/requests";
import {
  LoginPayloadT,
  LoginResponseT,
  RegisterPayloadT,
  RegisterResponseT,
} from "@/services/auth/types";
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

export const useRegisterMutation = () => {
  return useMutation<RegisterResponseT, ApiErrorResponseT, RegisterPayloadT>({
    mutationFn: registerRequest,
    onSuccess: (data) => {},
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
