import { Router } from "express";
import { authRoutes } from "@/routes/auth";
import { apiKeyRoutes } from "@/routes/api-keys";

export const registerRoutes = (app: Router) => {
  app.use("/auth", authRoutes);
  app.use("/api-keys", apiKeyRoutes);
};
