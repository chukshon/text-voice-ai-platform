import { z } from "@repo/common";
import { VoiceGenderEnum, VoiceCategoryEnum } from "@repo/db";

const baseVoiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  category: z.enum([VoiceCategoryEnum.CLONED, VoiceCategoryEnum.CUSTOM, VoiceCategoryEnum.PREMADE]),
  language: z.string().min(1).max(10).default("en"),
  gender: z
    .enum([VoiceGenderEnum.MALE, VoiceGenderEnum.FEMALE, VoiceGenderEnum.NEUTRAL])
    .default(VoiceGenderEnum.NEUTRAL),
  description: z.string().optional(),
  accent: z.string().max(100).optional(),
  isPublic: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createVoiceSchema = baseVoiceSchema;

export const updateVoiceSchema = baseVoiceSchema.omit({ category: true }).partial();

export type CreateVoiceInputT = z.infer<typeof createVoiceSchema>;
export type UpdateVoiceInputT = z.infer<typeof updateVoiceSchema>;
