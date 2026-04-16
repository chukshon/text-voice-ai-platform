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

voiceSampleRoutes.post("/", authenticateUser, upload.single("file"), createVoiceSampleHandler);
voiceSampleRoutes.get("/", authenticateUser, listAllUserVoiceSamplesHandler);
voiceSampleRoutes.get("/:sampleId", authenticateUser, getVoiceSampleByIdHandler);
voiceSampleRoutes.delete("/:sampleId", authenticateUser, deleteVoiceSampleByIdHandler);
