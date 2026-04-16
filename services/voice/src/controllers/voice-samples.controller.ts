import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import {
  createVoiceSampleService,
  listAllUserVoiceSamplesService,
} from "@/services/voice-samples.service";

export const createVoiceSampleHandler: RequestHandler = asyncHandler(async (req, res) => {
  const file = req.file as Express.Multer.File;
  const userId = req.user?.id as string;
  const voiceId = req.params.voiceId as string;

  const voiceSample = await createVoiceSampleService(file, userId, voiceId);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "Voice Sample Created",
    data: voiceSample,
  });
});

export const listAllUserVoiceSamplesHandler: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const voiceId = req.params.voiceId as string;

  const voiceSamples = await listAllUserVoiceSamplesService(voiceId, userId);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: voiceSamples,
  });
});
