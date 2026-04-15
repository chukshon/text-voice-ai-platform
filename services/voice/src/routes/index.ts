import { Router } from "express";
import { voiceRoutes } from "@/routes/voice.routes";

export const registerRoutes = (app: Router) => {
  app.use("/voice", voiceRoutes);
};
