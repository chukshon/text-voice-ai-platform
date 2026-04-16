import { Router } from "express";
import { voiceRoutes } from "@/routes/voices.routes";
import { libraryRoutes } from "@/routes/library.routes";
import { voiceSampleRoutes } from "@/routes/voice-samples.routes";

export const registerRoutes = (app: Router) => {
  app.use("/voices", voiceRoutes);
  app.use("/library", libraryRoutes);
  app.use("/voice-samples", voiceSampleRoutes);
};
