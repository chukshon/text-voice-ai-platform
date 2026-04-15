import {
  loginHandler,
  registerHandler,
  refreshTokenHandler,
  getCurrentUserHandler,
} from "@/controllers/auth.controller";
import { authenticateUser } from "@/middlewares/authenticate-user";
import { registerInputSchema, loginInputSchema, refreshTokenSchema } from "@/validators/auth";
import { validateRequest } from "@repo/common";
import { Router } from "express";

export const authRoutes: Router = Router();

authRoutes.post("/register", validateRequest({ body: registerInputSchema }), registerHandler);
authRoutes.post("/login", validateRequest({ body: loginInputSchema }), loginHandler);
authRoutes.post(
  "/refresh-token",
  validateRequest({ body: refreshTokenSchema }),
  refreshTokenHandler,
);
authRoutes.get("/me", authenticateUser, getCurrentUserHandler);
