import { Router } from "express";
import { upload } from "@/lib/multer";
import {
  createVoiceSampleHandler,
  getVoiceSampleByIdHandler,
  listAllUserVoiceSamplesHandler,
  deleteVoiceSampleByIdHandler,
} from "@/controllers/voice-samples.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";

export const voiceSampleRoutes: Router = Router();

voiceSampleRoutes.post(
  "/:voiceId/samples",
  authenticateUser,
  upload.single("file"),
  createVoiceSampleHandler,
);
voiceSampleRoutes.get("/:voiceId/samples", authenticateUser, listAllUserVoiceSamplesHandler);
voiceSampleRoutes.get("/:voiceId/samples/:sampleId", authenticateUser, getVoiceSampleByIdHandler);
voiceSampleRoutes.delete(
  "/:voiceId/samples/:sampleId",
  authenticateUser,
  deleteVoiceSampleByIdHandler,
);
