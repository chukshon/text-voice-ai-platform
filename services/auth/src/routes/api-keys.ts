import { createApiKeyHandler, listAllApiKeysHandler } from "@/controllers/api-keys.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";
import { createApiKeySchema } from "@/validators/api-keys";
import { validateRequest } from "@repo/common";
import { Router } from "express";

export const apiKeyRoutes: Router = Router();

apiKeyRoutes.post(
  "/",
  validateRequest({ body: createApiKeySchema }),
  authenticateUser,
  createApiKeyHandler,
);

apiKeyRoutes.get("/", authenticateUser, listAllApiKeysHandler);
