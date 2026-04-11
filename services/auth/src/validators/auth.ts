import { z } from "@repo/common";

export const emailSchema = z.string().trim().email("Invalid email address").min(1).max(255);
export const passwordSchema = z.string().trim().min(4);

export const registerInputSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
});

export const loginInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterInputT = z.infer<typeof registerInputSchema>;
export type LoginInputT = z.infer<typeof loginInputSchema>;
