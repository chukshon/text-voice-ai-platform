import { LoginInputT, RegisterInputT, RefreshTokenInputT } from "@/validators/auth";
import { prisma } from "@repo/db";
import { AuthResponseT, RefreshAuthResponseT, UserDataT } from "@/types/auth";
import { BadRequestException, UnauthorizedException } from "@repo/common";
import { hashPassword, verifyPassword } from "@/lib/bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import { logger } from "@/utils/logger";

const REFRESH_TOKEN_TTL_DAYS = 30;

export const registerService = async (payload: RegisterInputT): Promise<AuthResponseT> => {
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

export const loginService = async (payload: LoginInputT): Promise<AuthResponseT> => {
  const { email: payloadEmail, password: payloadPassword } = payload;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: payloadEmail,
    },
  });

  if (!existingUser) {
    throw new BadRequestException("Invalid email or password");
  }

  const isPasswordValid = await verifyPassword(payloadPassword, existingUser.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedException("Invalid email or password");
  }

  const refreshTokenRecord = await createRefreshToken(existingUser.id);

  const accessToken = generateAccessToken({
    sub: existingUser.id,
    email: existingUser.email,
  });
  const refreshToken = generateRefreshToken({
    sub: existingUser.id,
    tokenId: refreshTokenRecord.id,
  });

  return {
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (
  payload: RefreshTokenInputT,
): Promise<RefreshAuthResponseT> => {
  const { refreshToken } = payload;

  const refreshTokenPayload = verifyRefreshToken(refreshToken);

  if (!refreshTokenPayload) {
    throw new UnauthorizedException("Invalid refresh token");
  }

  const refreshTokenRecord = await prisma.refreshToken.findFirst({
    where: { tokenHash: refreshTokenPayload.tokenId, userId: refreshTokenPayload.sub },
  });

  if (!refreshTokenRecord) {
    throw new UnauthorizedException("Invalid refresh token");
  }

  if (refreshTokenRecord.expiresAt.getTime() < Date.now()) {
    await prisma.refreshToken.delete({
      where: { id: refreshTokenRecord.id },
    });
    throw new UnauthorizedException("Expired refresh token");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: refreshTokenPayload.sub,
    },
  });

  if (!existingUser) {
    throw new BadRequestException("User not found");
  }

  await prisma.refreshToken.delete({
    where: { id: refreshTokenRecord.id },
  });

  const newTokenRecord = await createRefreshToken(existingUser.id);

  const accessToken = generateAccessToken({
    sub: existingUser.id,
    email: existingUser.email,
  });

  const newRefreshToken = generateRefreshToken({
    sub: existingUser.id,
    tokenId: newTokenRecord.id,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const currentUserService = async (userId: string): Promise<UserDataT> => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      passwordHash: true,
      updatedAt: true,
    },
  });

  if (!existingUser) {
    throw new BadRequestException("Invalid email or password");
  }

  return existingUser;
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
