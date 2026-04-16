import { Router } from "express";
import { upload } from "@/lib/multer";
import {
  createVoiceSampleHandler,
  listAllUserVoiceSamplesHandler,
} from "@/controllers/voice-samples.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";

export const voiceSampleRoutes: Router = Router();

voiceSampleRoutes.post("/", authenticateUser, upload.single("file"), createVoiceSampleHandler);
voiceSampleRoutes.get("/", authenticateUser, listAllUserVoiceSamplesHandler);
