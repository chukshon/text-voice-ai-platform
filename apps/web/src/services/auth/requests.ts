import api from "@/config/axios";
import {
  LoginPayloadT,
  LoginResponseT,
  RegisterPayloadT,
  RegisterResponseT,
} from "@/services/auth/types";

export const loginRequest = async (payload: LoginPayloadT): Promise<LoginResponseT> => {
  const { data } = await api.post<LoginResponseT>("auth/login", payload);
  return data;
};

export const registerRequest = async (payload: RegisterPayloadT): Promise<RegisterResponseT> => {
  const { data } = await api.post<RegisterResponseT>("auth/register", payload);
  return data;
};
