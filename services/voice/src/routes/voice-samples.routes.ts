import { Router } from "express";
import { validateRequest } from "@repo/common";
import { paramsIdSchema } from "@/validators/shared";
import { upload } from "@/lib/multer";
import { createVoiceSampleHandler } from "@/controllers/voice-samples.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";

export const voiceSampleRoutes: Router = Router();

voiceSampleRoutes.post(
  "/voices/:id/samples",
  authenticateUser,
  validateRequest({ params: paramsIdSchema }),
  upload.single("file"),
  createVoiceSampleHandler,
);
