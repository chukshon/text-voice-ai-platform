import "dotenv/config";
import { createEnv, z } from "@repo/common";

const envSchema = z.object({
  VOICE_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(3001),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("1d"),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  MINIO_ENDPOINT: z.string().min(1),
  MINIO_PORT: z.coerce.number().int().min(0).max(65_535).default(9000),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_BUCKET: z.string().min(1),
  MINIO_USE_SSL: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default("false"),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: "voice-service",
});

export type Env = typeof env;
