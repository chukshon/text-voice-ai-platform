import { Router } from "express";
import { validateRequest } from "@repo/common";
import { createJobSchema } from "@/validators/job.validator";
import { createJobHandler } from "@/controllers/jobs.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";

export const jobsRoutes: Router = Router();

jobsRoutes.post(
  "/",
  authenticateUser,
  validateRequest({ body: createJobSchema }),
  createJobHandler,
);
