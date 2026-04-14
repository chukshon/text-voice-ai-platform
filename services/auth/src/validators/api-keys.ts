import { z } from "@repo/common";

export const createApiKeySchema = z.object({
  name: z.string().min(1, "Api Key Name is required").max(255),
  expiresAt: z.coerce.date().optional(),
});

export type CreateApiKeyInputT = z.infer<typeof createApiKeySchema>;
