import api from "@/config/axios";
import { GetLibraryQueryT } from "@/schema/voices.schema";
import { GetLibraryResponseT } from "@/services/voices/types";
import { toQueryString } from "@/lib/utils";
import { CreateVoiceResponseT } from "@/services/voices/types";
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
