import { Router } from "express";
import { validateRequest } from "@repo/common";
import { createTTSJobSchema } from "@/validators/tts-job.validator";
import { createTTSJobHandler } from "@/controllers/tts-job.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";

export const ttsRoutes: Router = Router();

ttsRoutes.post(
  "/",
  authenticateUser,
  validateRequest({ body: createTTSJobSchema }),
  createTTSJobHandler,
);
