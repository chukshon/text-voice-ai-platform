import { CreateApiKeyInputT } from "@/validators/api-keys";
import { prisma } from "@repo/db";
import { CreateApiKeyResponseT } from "@/types/api-keys";
import { generateApiKey, hashToken } from "@/utils";

export const createApiKeyService = async (
  payload: CreateApiKeyInputT,
  userId: string,
): Promise<CreateApiKeyResponseT> => {
  const { key, prefix } = generateApiKey();
  const keyHash = hashToken(key);

  const createdApiKey = await prisma.apiKey.create({
    data: {
      name: payload.name,
      expiresAt: payload.expiresAt ?? null,
      keyHash,
      prefix,
      userId,
    },
    select: {
      id: true,
      name: true,
      prefix: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return {
    ...createdApiKey,
    apiKey: key,
  };
};
