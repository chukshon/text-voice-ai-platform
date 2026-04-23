import "dotenv/config";
import { createEnv, z } from "@repo/common";

const envSchema = z.object({
  WORKER_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(3001),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("1d"),

  RABBITMQ_URL: z.string().url(),

  MINIO_ENDPOINT: z.string().min(1),
  MINIO_PORT: z.coerce.number().int().min(0).max(65_535).default(9000),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_BUCKET: z.string().min(1),
  MINIO_USE_SSL: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default("false"),

  TTS_SERVICE_URL: z.string().url().default("http://localhost:8000"),
  TTS_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(0).default(60000),
  TTS_REQUEST_RETRIES: z.coerce.number().int().min(0).default(2),
});

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = createEnv(envSchema, {
  serviceName: "worker-service",
});

export type Env = typeof env;
