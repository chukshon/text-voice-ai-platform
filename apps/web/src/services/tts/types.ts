import { JobStatus, JobType } from "@/constants/tts";
import { ApiSuccessResponseT, ApiPaginationResponseT } from "@/types/api";

export interface JobT {
  id: string;
  status: JobStatus;
  type: JobType;
  inputText: string | null;
  voiceId: string;
  outputFileId: string | null;
  error: string | null;
  createdAt: Date;
}

export interface AudioFileInfoT {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  durationMs: number | null;
  storagePath: string;
}

export interface JobResponseT {
  job: JobT;
  audioFile: AudioFileInfoT | null;
  downloadUrl: string | null;
}

export type CreateTTSJobResponseT = ApiSuccessResponseT<JobT>;

export type GetTTSJobsResponseT = ApiSuccessResponseT<ApiPaginationResponseT<JobT>>;

export type GetTTSJobByIdResponseT = ApiSuccessResponseT<JobResponseT>;
