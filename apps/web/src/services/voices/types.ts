import { ApiSuccessResponseT, ApiPaginationResponseT } from "@/types/api";
import { VoiceCategoryEnum, VoiceGenderEnum, VoiceLanguageEnum } from "@/constants/voice";

export interface VoiceT {
  language: VoiceLanguageEnum;
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

export type UpdateVoiceResponseT = ApiSuccessResponseT<VoiceT>;

export type GetVoicesResponseT = ApiSuccessResponseT<VoiceT[]>;
