import api from "@/config/axios";
import { GetLibraryQueryT, UpdateVoicePayloadT } from "@/schema/voices.schema";
import {
  GetLibraryResponseT,
  GetVoiceByIdResponseT,
  UpdateVoiceResponseT,
} from "@/services/voices/types";
import { toQueryString } from "@/lib/utils";
import { CreateVoiceResponseT, GetVoicesResponseT } from "@/services/voices/types";
import { CreateVoicePayloadT } from "@/schema/voices.schema";

export const getLibraryRequest = async (
  payload: GetLibraryQueryT,
): Promise<GetLibraryResponseT> => {
  const query = toQueryString(payload);
  const { data } = await api.get<GetLibraryResponseT>(`/library${query}`);
  return data;
};

export const createVoiceRequest = async (
  payload: CreateVoicePayloadT,
): Promise<CreateVoiceResponseT> => {
  const { data } = await api.post<CreateVoiceResponseT>(`/voices`, payload);
  return data;
};

export const updateVoiceRequest = async (
  payload: UpdateVoicePayloadT,
): Promise<UpdateVoiceResponseT> => {
  const { data } = await api.put<UpdateVoiceResponseT>(`/voices/${payload.id}`, payload);
  return data;
};
export const getVoicesRequest = async (): Promise<GetVoicesResponseT> => {
  const { data } = await api.get<GetVoicesResponseT>(`/voices`);
  return data;
};

export const getVoiceByIdRequest = async (voiceId: string): Promise<GetVoiceByIdResponseT> => {
  const { data } = await api.get<GetVoiceByIdResponseT>(`/voices/${voiceId}`);
  return data;
};
