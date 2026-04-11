import { env } from "@/config/env";
import { Request, Response, NextFunction, type RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { AuthenticatedUser } from "@/types/auth";

import { AppError, HTTPSTATUS, UnauthorizedException } from "@repo/common";

interface AccessTokenPayload {
  sub: string;
  email: string;
}

const parseAuthorizationHeader = (value: string | undefined): string => {
  if (!value) {
    throw new UnauthorizedException("Unauthorized");
  }

  const [scheme, token] = value.split(" ");

  if (scheme.toLowerCase() !== "bearer" || !token) {
    throw new UnauthorizedException("Unauthorized");
  }

  return token;
};

const validateAccessTokenPayload = (payload: AccessTokenPayload): AuthenticatedUser => {
  if (!payload.sub || !payload.email) {
    throw new UnauthorizedException("Unauthorized");
  }
  return {
    id: payload.sub,
    email: payload.email,
  };
};

export const authenticateUser: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = parseAuthorizationHeader(req.headers.authorization);
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
    const user = validateAccessTokenPayload(payload);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(new AppError("Unauthorized", HTTPSTATUS.UNAUTHORIZED));
  }
};
