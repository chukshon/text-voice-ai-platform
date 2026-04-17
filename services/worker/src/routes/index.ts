import { Router } from "express";
import { ttsJobRoutes } from "@/routes/tts-job.routes";

export const registerRoutes = (app: Router) => {
  app.use("/tts", ttsJobRoutes);
};
