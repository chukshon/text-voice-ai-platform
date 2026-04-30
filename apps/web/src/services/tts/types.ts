import { JobStatus, JobType } from "@/constants/tts";
import { ApiSuccessResponseT, ApiPaginationResponseT } from "@/types/api";

export interface JobT {
  id: string;
  status: JobStatus;
  type: JobType;
  inputText: string | null;
  outputFileId: string | null;
  error: string | null;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
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

export type CreateTTSJobResponseT = ApiSuccessResponseT<JobResponseT>;

export type GetTTSJobsResponseT = ApiSuccessResponseT<JobResponseT[]>;

export type GetTTSJobByIdResponseT = ApiSuccessResponseT<JobResponseT>;
