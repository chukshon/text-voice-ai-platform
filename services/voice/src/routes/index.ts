import { Router } from "express";
import { voiceRoutes } from "@/routes/voices.routes";
import { libraryRoutes } from "@/routes/library.routes";

export const registerRoutes = (app: Router) => {
  app.use("/voices", voiceRoutes);
  app.use("/library", libraryRoutes);
};
