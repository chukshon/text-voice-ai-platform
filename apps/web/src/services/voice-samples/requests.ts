import api from "@/config/axios";
import { CreateVoiceSamplePayloadT } from "@/schema/voice-sample.schema";
import {
  CreateVoiceSampleResponseT,
  DeleteVoiceSamplePayloadT,
  DeleteVoiceSampleResponseT,
  GetVoiceSamplesResponseT,
} from "./types";

export const createVoiceSampleRequest = async (
  payload: CreateVoiceSamplePayloadT,
): Promise<CreateVoiceSampleResponseT> => {
  const { data } = await api.post<CreateVoiceSampleResponseT>(
    `/voices/${payload.voiceId}/samples`,
    {
      file: payload.file,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
};

export const getVoiceSamplesRequest = async (
  voiceId: string,
): Promise<GetVoiceSamplesResponseT> => {
  const { data } = await api.get<GetVoiceSamplesResponseT>(`/voices/${voiceId}/samples`);
  return data;
};

export const deleteVoiceSampleRequest = async (
  payload: DeleteVoiceSamplePayloadT,
): Promise<DeleteVoiceSampleResponseT> => {
  const { data } = await api.delete<DeleteVoiceSampleResponseT>(
    `/voices/${payload.voiceId}/samples/${payload.sampleId}`,
  );
  return data;
};
