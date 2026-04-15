import { CreateVoiceInputT, UpdateVoiceInputT } from "@/validators/voice";
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

export const updateUserVoiceByIdService = async (
  payload: UpdateVoiceInputT,
  voiceId: string,
  currentUserId: string,
) => {
  const existingVoice = await prisma.voice.findFirst({
    where: {
      id: voiceId,
      AND: {
        userId: currentUserId,
      },
    },
  });

  if (!existingVoice) {
    logger.error("Voice Not Found", {
      voiceId,
      currentUserId,
    });
    throw new NotFoundException("Voice not found");
  }

  const updatedVoice = await prisma.voice.update({
    where: {
      id: voiceId,
    },
    data: {
      ...payload,
      metadata: payload.metadata as any,
      updatedAt: new Date(),
    },
  });

  return updatedVoice;
};
