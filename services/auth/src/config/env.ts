import "dotenv/config";
import { createEnv, z } from "@repo/common";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(0).max(65_535).default(8000),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: "auth-service",
});

export type Env = typeof env;
