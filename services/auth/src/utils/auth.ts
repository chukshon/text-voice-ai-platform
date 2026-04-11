import type { Request } from "express";
import { AppError, HTTPSTATUS } from "@repo/common";
import { AuthenticatedUser } from "@/types/auth";

export const getAuthenticatedUser = (req: Request): AuthenticatedUser => {
  if (!req.user) {
    throw new AppError("Unauthorized", HTTPSTATUS.UNAUTHORIZED);
  }
  return req.user;
};
