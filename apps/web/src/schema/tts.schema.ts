import { z } from "zod";
import { ALLOWED_OUTPUT_ENUM } from "@/constants/tts";

export const createTTSJobSchema = z.object({
  voiceId: z.string().uuid(),
  text: z.string().min(1, "Text is required").max(5000),
  outputFormat: z
    .enum([ALLOWED_OUTPUT_ENUM.MP3, ALLOWED_OUTPUT_ENUM.WAV])
    .default(ALLOWED_OUTPUT_ENUM.MP3),
});

export type CreateTTSJobPayloadT = z.input<typeof createTTSJobSchema>;
