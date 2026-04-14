import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { CreateApiKeyInputT } from "@/validators/api-keys";
import {
  createApiKeyService,
  deleteApiKeyService,
  listAllApiKeysService,
} from "@/services/api-keys.service";

export const createApiKeyHandler: RequestHandler = asyncHandler(async (req, res) => {
  const payload = req.body as CreateApiKeyInputT;
  const userId = req.user?.id as string;

  const createdApiKey = await createApiKeyService(payload, userId);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "Api Key Created successfully",
    data: createdApiKey,
  });
});

export const listAllApiKeysHandler: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;

  const apiKeys = await listAllApiKeysService(userId);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    data: apiKeys,
  });
});

export const deleteApiKeyHandler: RequestHandler = asyncHandler(async (req, res) => {
  const apiKeyId = req.params.id as string;
  const userId = req.user?.id as string;

  await deleteApiKeyService(apiKeyId, userId);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: "API key revoked",
  });
});
