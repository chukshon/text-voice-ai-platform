import { z } from "@repo/common";

export const paramsIdSchema = z.object({
  id: z.string().uuid("ID must be a valid UUID").min(1, "ID is required"),
});

export const paginationQuerySchema = z.object({
  pageNumber: z.coerce
    .number()
    .int()
    .min(1, "Page number must be greater than 0")
    .optional()
    .default(1),
  limit: z.coerce.number().int().min(1, "Limit must be greater than 0").optional().default(20),
});

export type ParamsIdT = z.infer<typeof paramsIdSchema>;
export type PaginationQueryT = z.infer<typeof paginationQuerySchema>;
