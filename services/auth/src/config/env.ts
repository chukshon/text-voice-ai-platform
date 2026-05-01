import "dotenv/config";
import { createEnv, z } from "@repo/common";

const envSchema = z.object({
  AUTH_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(3001),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("1d"),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  FRONTEND_URL: z.string().url(),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: "auth-service",
});

export type Env = typeof env;
