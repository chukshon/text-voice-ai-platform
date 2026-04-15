import { z } from "@repo/common";

const baseVoiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  category: z.enum(["cloned", "custom"]),
  language: z.string().min(1).max(10).default("en"),
  gender: z.enum(["male", "female", "neutral"]).default("neutral"),
  description: z.string().optional(),
  accent: z.string().max(100).optional(),
  isPublic: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const createVoiceSchema = baseVoiceSchema;

const updateVoiceSchema = baseVoiceSchema.omit({ category: true }).partial();

export type CreateVoiceSchemaT = z.infer<typeof createVoiceSchema>;
export type UpdateVoiceSchemaT = z.infer<typeof updateVoiceSchema>;
