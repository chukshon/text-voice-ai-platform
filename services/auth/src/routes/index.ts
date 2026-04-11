import { Router } from "express";
import { authRoutes } from "@/routes/auth";

export const registerRoutes = (app: Router) => {
  app.use("/auth", authRoutes);
};
