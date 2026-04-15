import { CreateApiKeyInputT } from "@/validators/api-keys";
import { prisma } from "@repo/db";
import { CreateApiKeyResponseT } from "@/types/api-keys";
import { generateApiKey, hashToken } from "@/utils";
import { logger } from "@/utils/logger";
import { BadRequestException, NotFoundException } from "@repo/common";

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

export const listAllApiKeysService = async (userId: string) => {
  const apiKeys = await prisma.apiKey.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      prefix: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    apiKeys,
  };
};

export const deleteApiKeyService = async (apiKeyId: string, userId: string) => {
  const existingApiKey = await prisma.apiKey.findUnique({
    where: {
      id: apiKeyId,
    },
  });

  if (!existingApiKey) {
    throw new BadRequestException("Api Key not found");
  }

  await prisma.apiKey.delete({
    where: {
      id: apiKeyId,
      userId,
    },
    select: {
      id: true,
    },
  });
};
