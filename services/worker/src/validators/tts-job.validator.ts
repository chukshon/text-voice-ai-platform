import { z } from "@repo/common";
import { ALLOWED_OUTPUT_ENUM } from "@/constants";

export const createTTSJobSchema = z.object({
  voiceId: z.string().uuid(),
  text: z.string().min(1, "Text is required").max(5000),
  outputFormat: z
    .enum([ALLOWED_OUTPUT_ENUM.MP3, ALLOWED_OUTPUT_ENUM.WAV])
    .default(ALLOWED_OUTPUT_ENUM.MP3),
});

export type CreateTTSJobInputT = z.infer<typeof createTTSJobSchema>;
