import { ApiSuccessResponseT } from "@/types/api";

export interface VoiceSampleT {
  id: string;
  createdAt: Date;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  durationMs: number | null;
  storagePath: string;
  voiceId: string;
}

export type CreateVoiceSampleResponseT = ApiSuccessResponseT<VoiceSampleT>;

export type GetVoiceSamplesResponseT = ApiSuccessResponseT<VoiceSampleT[]>;

export type DeleteVoiceSampleResponseT = ApiSuccessResponseT<VoiceSampleT>;

export type DeleteVoiceSamplePayloadT = {
  voiceId: string;
  sampleId: string;
};
