import {
  createVoiceHandler,
  getUserVoiceByIdHandler,
  listUserVoicesHandler,
  updateUserVoiceByIdHandler,
} from "@/controllers/voice.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";
import { createVoiceSchema, updateVoiceSchema } from "@/validators/voice";
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
voiceRoutes.get("/:id", authenticateUser, getUserVoiceByIdHandler);
voiceRoutes.put(
  "/:id",
  validateRequest({ body: updateVoiceSchema }),
  authenticateUser,
  updateUserVoiceByIdHandler,
);
