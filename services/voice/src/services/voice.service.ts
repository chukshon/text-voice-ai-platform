import { CreateVoiceInputT } from "@/validators/voice";
import { prisma } from "@repo/db";
import { logger } from "@/utils/logger";
import { BadRequestException, NotFoundException } from "@repo/common";

export const createVoiceService = async (payload: CreateVoiceInputT, userId: string) => {
  const createdVoice = await prisma.voice.create({
    data: {
      ...payload,
      metadata: payload.metadata as any,
      userId,
    },
  });
  return createdVoice;
};

export const listUserVoicesService = async (userId: string) => {
  const userVoices = await prisma.voice.findMany({
    where: {
      id: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return userVoices;
};
