import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { CreateTTSJobInputT } from "@/validators/tts-job.validator";
import { createTTSJobService } from "@/services/tts-job.service";

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
