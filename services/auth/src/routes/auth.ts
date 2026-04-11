import { loginHandler, registerHandler } from "@/controllers/auth.controller";
import { registerInputSchema, loginInputSchema } from "@/validators/auth";
import { validateRequest } from "@repo/common";
import { Router } from "express";

export const authRoutes: Router = Router();

authRoutes.post("/register", validateRequest({ body: registerInputSchema }), registerHandler);
authRoutes.post("/login", validateRequest({ body: loginInputSchema }), loginHandler);
