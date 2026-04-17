import { Router } from "express";
import { validateRequest } from "@repo/common";
import { createTTSJobSchema } from "@/validators/tts-job.validator";
import {
  createTTSJobHandler,
  getTTSJobByIdHandler,
  listTTSJobsHandler,
} from "@/controllers/tts-job.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";
import { paginationQuerySchema, paramsIdSchema } from "@/validators/shared.validator";

export const ttsJobRoutes: Router = Router();

ttsJobRoutes.post(
  "/",
  authenticateUser,
  validateRequest({ body: createTTSJobSchema }),
  createTTSJobHandler,
);

ttsJobRoutes.get(
  "/:id",
  authenticateUser,
  validateRequest({ params: paramsIdSchema }),
  getTTSJobByIdHandler,
);

ttsJobRoutes.get(
  "/",
  authenticateUser,
  validateRequest({ query: paginationQuerySchema }),
  listTTSJobsHandler,
);
