import { Request, Response, NextFunction, type RequestHandler } from "express";
import { prisma } from "@repo/db";
import { AuthenticatedUser } from "@/types/auth";
import { AppError, HTTPSTATUS, UnauthorizedException } from "@repo/common";
import { hashToken } from "@/utils";
import { logger } from "@/utils/logger";
import { verifyAccessToken } from "@/lib/jwt";

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
  const apiKeyHash = hashToken(key);

  const existingApiKey = await prisma.apiKey.findUnique({
    where: {
      keyHash: apiKeyHash,
    },
  });

  if (!existingApiKey) {
    throw new UnauthorizedException("Invalid API key");
  }

  if (existingApiKey.expiresAt && existingApiKey.expiresAt < new Date()) {
    throw new UnauthorizedException("API key has expired");
  }

  const existingUser = await prisma.user.findUnique({
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

  void prisma.apiKey
    .update({
      where: { id: existingApiKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch((err) => {
      // log only; don't break auth flow
      logger?.warn?.("Failed to update api key lastUsedAt", { err, apiKeyId: existingApiKey.id });
    });

  req.user = { id: existingUser.id, email: existingUser.email };
}

export const authenticateUser: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = parseAuthorizationHeader(req.headers.authorization).trim();

    if (token.startsWith("xi_")) {
      await authenticateApiKey(token, req, _res);
      return next();
    }

    const payload = verifyAccessToken(token);
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
