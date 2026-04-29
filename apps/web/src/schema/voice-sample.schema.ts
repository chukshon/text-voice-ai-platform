import z from "zod";

export const createVoiceSampleSchema = z.object({
  file: z.instanceof(File),
  voiceId: z.string().min(1, "Voice ID is required"),
});

export type CreateVoiceSamplePayloadT = z.input<typeof createVoiceSampleSchema>;
