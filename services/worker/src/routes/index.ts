import { Router } from "express";
import { jobsRoutes } from "@/routes/jobs.routes";

export const registerRoutes = (app: Router) => {
  app.use("/tts", jobsRoutes);
};
