import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { RegisterInputT, LoginInputT, RefreshTokenInputT } from "@/validators/auth";
import { registerService, loginService, refreshTokenService } from "@/services/auth.service";

export const registerHandler: RequestHandler = asyncHandler(async (req, res) => {
  const payload = req.body as RegisterInputT;

  const result = await registerService(payload);

  res.status(HTTPSTATUS.CREATED).json({
    message: "User registered successfully",
    data: result,
  });
});

export const loginHandler: RequestHandler = asyncHandler(async (req, res) => {
  const payload = req.body as LoginInputT;

  const result = await loginService(payload);

  res.status(HTTPSTATUS.CREATED).json({
    message: "User Logged in successfully",
    data: result,
  });
});

export const refreshTokenHandler: RequestHandler = asyncHandler(async (req, res) => {
  const payload = req.body as RefreshTokenInputT;

  const result = await refreshTokenService(payload);

  res.status(HTTPSTATUS.CREATED).json({
    data: result,
  });
});
