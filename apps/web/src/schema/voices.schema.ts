import { z } from "@repo/common";
import { VoiceCategoryEnum, VoiceGenderEnum } from "@repo/db";

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

export type GetLibraryQueryT = z.infer<typeof getLibraryQuerySchema>;
