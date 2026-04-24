import api from "@/config/axios";
import {
  LoginPayloadT,
  LoginResponseT,
  RefreshTokenPayloadT,
  RegisterPayloadT,
  RegisterResponseT,
  GetLoggedInUserResponseT,
  RefreshTokenResponseT,
} from "@/services/auth/types";

export const loginRequest = async (payload: LoginPayloadT): Promise<LoginResponseT> => {
  const { data } = await api.post<LoginResponseT>("auth/login", payload);
  return data;
};

export const registerRequest = async (payload: RegisterPayloadT): Promise<RegisterResponseT> => {
  const { data } = await api.post<RegisterResponseT>("auth/register", payload);
  return data;
};

export const getLoggedInUserRequest = async (): Promise<GetLoggedInUserResponseT> => {
  const { data } = await api.get<GetLoggedInUserResponseT>("auth/me");
  return data;
};
