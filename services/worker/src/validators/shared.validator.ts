import { z } from "@repo/common";

export const paramsIdSchema = z.object({
  id: z.string().uuid("ID must be a valid UUID").min(1, "ID is required"),
});

export type ParamsIdT = z.infer<typeof paramsIdSchema>;
