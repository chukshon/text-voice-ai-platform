import {
  createApiKeyHandler,
  listAllApiKeysHandler,
  deleteApiKeyHandler,
} from "@/controllers/api-keys.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";
import { createApiKeySchema } from "@/validators/api-keys";
import { paramsIdSchema } from "@/validators/shared";
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
apiKeyRoutes.delete(
  "/delete/:id",
  validateRequest({ params: paramsIdSchema }),
  authenticateUser,
  deleteApiKeyHandler,
);
