import z from "zod";
import { VoiceCategoryEnum, VoiceGenderEnum, VoiceLanguageEnum } from "@/constants/voice";

export const getLibraryQuerySchema = z.object({
  searchKeyword: z.string().optional(),
  language: z.string().min(1).max(10).optional(),
  category: z
    .enum([VoiceCategoryEnum.CLONED, VoiceCategoryEnum.CUSTOM, VoiceCategoryEnum.PREMADE])
    .optional(),
  gender: z
    .enum([VoiceGenderEnum.MALE, VoiceGenderEnum.FEMALE, VoiceGenderEnum.NEUTRAL])
    .default(VoiceGenderEnum.NEUTRAL)
    .optional(),
  pageNumber: z.coerce
    .number()
    .int()
    .min(1, "Page number must be greater than 0")
    .optional()
    .default(1),
  limit: z.coerce.number().int().min(1, "Limit must be greater than 0").optional().default(20),
});

const baseVoiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  category: z.enum([VoiceCategoryEnum.CLONED, VoiceCategoryEnum.CUSTOM, VoiceCategoryEnum.PREMADE]),
  language: z.string().min(1).max(10).default(VoiceLanguageEnum.ENGLISH),
  gender: z
    .enum([VoiceGenderEnum.MALE, VoiceGenderEnum.FEMALE, VoiceGenderEnum.NEUTRAL])
    .default(VoiceGenderEnum.NEUTRAL),
  description: z.string().optional(),
  accent: z.string().max(100).optional(),
  isPublic: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createVoiceSchema = baseVoiceSchema;

export const updateVoiceSchema = baseVoiceSchema
  .omit({ category: true })
  .partial()
  .extend({
    id: z.string().min(1, "ID is required"),
  });

export type CreateVoicePayloadT = z.input<typeof createVoiceSchema>;
export type UpdateVoicePayloadT = z.input<typeof updateVoiceSchema>;
export type GetLibraryQueryT = z.infer<typeof getLibraryQuerySchema>;
