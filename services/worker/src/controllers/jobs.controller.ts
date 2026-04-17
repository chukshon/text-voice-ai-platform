import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { CreateJobInputT } from "@/validators/job.validator";
import { createJobService } from "@/services/jobs.service";

export const createJobHandler: RequestHandler = asyncHandler(async (req, res) => {
  const payload = req.body as CreateJobInputT;
  const userId = req.user?.id as string;

  const createdJob = await createJobService(payload, userId);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    message: "Job Created",
    data: createdJob,
  });
});
