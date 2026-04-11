import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS } from "@repo/common";
import { RegisterInputT } from "@/validators/auth";
import { registerService } from "@/services/auth.service";

export const registerHandler: RequestHandler = asyncHandler(async (req, res) => {
  const payload = req.body as RegisterInputT;

  const result = await registerService(payload);

  res.status(HTTPSTATUS.CREATED).json({
    message: "User registered successfully",
    data: result,
  });
});
