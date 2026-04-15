import { Router } from "express";
import { authRoutes } from "@/routes/auth.routes";
import { apiKeyRoutes } from "@/routes/api-keys.routes";

export const registerRoutes = (app: Router) => {
  app.use("/auth", authRoutes);
  app.use("/api-keys", apiKeyRoutes);
};
