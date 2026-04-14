import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { CreateApiKeyInputT } from "@/validators/api-keys";
import { createApiKeyService } from "@/services/api-keys.service";

export const createApiKeyHandler: RequestHandler = asyncHandler(async (req, res) => {
  const payload = req.body as CreateApiKeyInputT;

  const result = await createApiKeyService(payload);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "Api Key Created successfully",
    data: result,
  });
});
