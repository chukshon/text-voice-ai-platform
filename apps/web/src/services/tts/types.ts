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

export type CreateTTSJobResponseT = ApiSuccessResponseT<JobT>;

export type GetTTSJobsResponseT = ApiSuccessResponseT<JobT[]>;

export type GetTTSJobByIdResponseT = ApiSuccessResponseT<JobT>;
