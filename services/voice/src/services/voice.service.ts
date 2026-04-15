import { CreateVoiceInputT } from "@/validators/voice";
import { prisma } from "@repo/db";
import { logger } from "@/utils/logger";
import { NotFoundException } from "@repo/common";

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
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return userVoices;
};

export const getUserVoiceByIdService = async (voiceId: string, currentUserId: string) => {
  const voice = await prisma.voice.findFirst({
    where: {
      id: voiceId,
      AND: {
        userId: currentUserId,
      },
    },
  });

  if (!voice) {
    logger.error("Voice Not Found", {
      voiceId,
      currentUserId,
    });
    throw new NotFoundException("Voice not found");
  }

  return voice;
};
