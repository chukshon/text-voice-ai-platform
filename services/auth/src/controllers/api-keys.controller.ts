import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { CreateApiKeyInputT } from "@/validators/api-keys";
import {
  createApiKeyService,
  deleteApiKeyService,
  listAllApiKeysService,
} from "@/services/api-keys.service";
import { ParamsIdT } from "@/validators/shared";

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
