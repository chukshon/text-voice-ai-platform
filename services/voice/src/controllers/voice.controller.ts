import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { CreateVoiceInputT } from "@/validators/voice";
import { createVoiceService } from "@/services/voice.service";

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
