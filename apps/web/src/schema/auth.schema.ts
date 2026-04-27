import z from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .trim()
  .email("Invalid email address")
  .max(255, "Email must be less than 255 characters");
export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .trim()
  .min(4, "Password must be at least 4 characters long");

export const loginInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerInputSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInputT = z.infer<typeof loginInputSchema>;
export type RegisterInputT = z.infer<typeof registerInputSchema>;
