import { z } from "@repo/common";

export const createJobSchema = z.object({
  voiceId: z.string().uuid(),
  text: z.string().min(1, "Text is required").max(5000),
  outputFormat: z.enum(["mp3", "wav"]).default("mp3"),
});

export type CreateJobInputT = z.infer<typeof createJobSchema>;
