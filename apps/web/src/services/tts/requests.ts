import api from "@/config/axios";
import { CreateTTSJobPayloadT } from "@/schema/tts.schema";
import { CreateTTSJobResponseT, GetTTSJobByIdResponseT, GetTTSJobsResponseT } from "./types";

export const createTTSJobRequest = async (
  payload: CreateTTSJobPayloadT,
): Promise<CreateTTSJobResponseT> => {
  const { data } = await api.post<CreateTTSJobResponseT>(`/tts`, payload);
  return data;
};

export const getTTSJobsRequest = async (): Promise<GetTTSJobsResponseT> => {
  const { data } = await api.get<GetTTSJobsResponseT>(`/tts`);
  return data;
};

export const getTTSJobByIdRequest = async (jobId: string): Promise<GetTTSJobByIdResponseT> => {
  const { data } = await api.get<GetTTSJobByIdResponseT>(`/tts/${jobId}`);
  return data;
};
