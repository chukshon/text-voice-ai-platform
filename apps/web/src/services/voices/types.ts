import { ApiSuccessResponseT, ApiPaginationResponseT } from "@/types/api";
import { VoiceCategoryEnum, VoiceGenderEnum } from "@repo/db";

export interface VoiceT {
  language: string;
  category: VoiceCategoryEnum;
  gender: VoiceGenderEnum;
  id: string;
  name: string;
  description: string | null;
  accent: string | null;
  previewUrl: string | null;
  isPublic: boolean;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
}

export type GetLibraryResponseT = ApiSuccessResponseT<ApiPaginationResponseT<VoiceT>>;

export type CreateVoiceResponseT = ApiSuccessResponseT<VoiceT>;
