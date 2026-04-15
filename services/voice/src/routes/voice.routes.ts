import { createVoiceHandler, listUserVoicesHandler } from "@/controllers/voice.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";
import { createVoiceSchema } from "@/validators/voice";
import { validateRequest } from "@repo/common";
import { Router } from "express";

export const voiceRoutes: Router = Router();

voiceRoutes.post(
  "/",
  validateRequest({ body: createVoiceSchema }),
  authenticateUser,
  createVoiceHandler,
);

voiceRoutes.get("/", authenticateUser, listUserVoicesHandler);
