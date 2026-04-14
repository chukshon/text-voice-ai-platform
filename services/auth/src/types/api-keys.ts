import type { ApiKey } from "@repo/db";

export type ApiKeyDataT = Omit<ApiKey, "keyHash" | "updatedAt" | "lastUsedAt" | "userId">;

export type CreateApiKeyResponseT = ApiKeyDataT & {
  apiKey: string;
};
