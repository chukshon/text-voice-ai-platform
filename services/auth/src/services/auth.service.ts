import { RegisterInputT } from "@/validators/auth";
import { prisma } from "@repo/db";
import { RegisterResponseT } from "@/types/auth";
import { BadRequestException } from "@repo/common";
import { hashPassword } from "@/lib/bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/utils/logger";

const REFRESH_TOKEN_TTL_DAYS = 30;

export const registerService = async (payload: RegisterInputT): Promise<RegisterResponseT> => {
  const { name: payloadName, email: payloadEmail, password: payloadPassword } = payload;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: payloadEmail,
    },
  });

  if (existingUser) {
    throw new BadRequestException("User already exists");
  }

  const passwordHash = await hashPassword(payloadPassword);

  return await prisma.$transaction(async (tx) => {
    const newUser = await prisma.user.create({
      data: {
        name: payloadName,
        email: payloadEmail,
        passwordHash,
      },
      omit: {
        passwordHash: true,
        updatedAt: true,
      },
    });

    logger.info("New user created", {
      id: newUser.id,
      email: newUser.email,
    });

    const refreshTokenRecord = await createRefreshToken(newUser.id);

    const accessToken = generateAccessToken({
      sub: newUser.id,
      email: newUser.email,
    });

    const refreshToken = generateRefreshToken({
      sub: newUser.id,
      tokenId: refreshTokenRecord.id,
    });

    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  });
};

const createRefreshToken = async (userId: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

  const tokenId = crypto.randomUUID();

  const record = await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: tokenId,
      expiresAt,
    },
  });

  logger.info("Refresh token created", {
    id: record.id,
    email: record.tokenHash,
  });

  return record;
};
