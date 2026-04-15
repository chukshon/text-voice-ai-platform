import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { CreateVoiceInputT } from "@/validators/voice";
import {
  createVoiceService,
  listUserVoicesService,
  getUserVoiceByIdService,
} from "@/services/voice.service";

export const createVoiceHandler: RequestHandler = asyncHandler(async (req, res) => {
  const payload = req.body as CreateVoiceInputT;
  const userId = req.user?.id as string;

  const createdVoice = await createVoiceService(payload, userId);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "Voice Created successfully",
    data: createdVoice,
  });
});

export const listUserVoicesHandler: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;

  const userVoices = await listUserVoicesService(userId);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    data: userVoices,
  });
});

export const getUserVoiceById: RequestHandler = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id as string;
  const voiceId = req.params.id as string;

  const userVoice = await getUserVoiceByIdService(voiceId, currentUserId);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    data: userVoice,
  });
});
