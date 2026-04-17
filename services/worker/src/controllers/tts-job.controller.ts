import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { CreateTTSJobInputT } from "@/validators/tts-job.validator";
import { createTTSJobService, getTTSJobByIdService } from "@/services/tts-job.service";

export const createTTSJobHandler: RequestHandler = asyncHandler(async (req, res) => {
  const payload = req.body as CreateTTSJobInputT;
  const userId = req.user?.id as string;

  const createdJob = await createTTSJobService(payload, userId);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "Job Created",
    data: createdJob,
  });
});

export const getTTSJobByIdHandler: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const userId = req.user?.id as string;

  const job = await getTTSJobByIdService(id, userId);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: job,
  });
});
