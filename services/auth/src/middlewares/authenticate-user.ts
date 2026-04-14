import { env } from "@/config/env";
import { Request, Response, NextFunction, type RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";

import { AuthenticatedUser } from "@/types/auth";

import { AppError, HTTPSTATUS, UnauthorizedException } from "@repo/common";
import { hashToken } from "@/utils";

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

async function authenticateApiKey(key: string, req: Request, _res: Response) {
  const ApikeyHash = hashToken(key);

  const existingApiKey = await prisma.apiKey.findUnique({
    where: {
      keyHash: ApikeyHash,
    },
  });

  if (!existingApiKey) {
    throw new UnauthorizedException("Invalid API key");
  }

  if (existingApiKey.expiresAt && existingApiKey.expiresAt < new Date()) {
    throw new UnauthorizedException("API key has expired");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      id: existingApiKey.userId,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!existingUser) {
    throw new UnauthorizedException("User not found");
  }

  // Update lastUsedAt (fire-and-forget — don't slow down the request)
  await prisma.apiKey.update({
    where: {
      id: existingApiKey.id,
    },
    data: {
      lastUsedAt: new Date(),
    },
  });

  req.user = { id: existingUser.id, email: existingUser.email };
}

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
