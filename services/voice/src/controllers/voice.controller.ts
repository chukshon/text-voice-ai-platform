import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { CreateVoiceInputT, UpdateVoiceInputT } from "@/validators/voice";
import {
  createVoiceService,
  listUserVoicesService,
  getUserVoiceByIdService,
  updateUserVoiceByIdService,
  deleteUserVoiceByIdService,
} from "@/services/voice.service";

export const createVoiceHandler: RequestHandler = asyncHandler(async (req, res) => {
  const payload = req.body as CreateVoiceInputT;
  const userId = req.user?.id as string;

  const createdVoice = await createVoiceService(payload, userId);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "Voice Created",
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

export const getUserVoiceByIdHandler: RequestHandler = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id as string;
  const voiceId = req.params.id as string;

  const userVoice = await getUserVoiceByIdService(voiceId, currentUserId);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: userVoice,
  });
});

export const updateUserVoiceByIdHandler: RequestHandler = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id as string;
  const voiceId = req.params.id as string;
  const payload = req.body as UpdateVoiceInputT;

  const updatedVoice = await updateUserVoiceByIdService(payload, voiceId, currentUserId);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: updatedVoice,
    message: "Voice Updated",
  });
});

export const deleteUserVoiceByIdHandler: RequestHandler = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.id as string;
  const voiceId = req.params.id as string;

  await deleteUserVoiceByIdService(voiceId, currentUserId);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    message: "Voice Deleted",
  });
});
