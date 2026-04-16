import { prisma } from "@repo/db";
import { logger } from "@/utils/logger";
import { BadRequestException, NotFoundException } from "@repo/common";
import { ALLOWED_MIME_TYPES } from "@/constants";
import { randomUUID } from "node:crypto";
import { deleteFile, getPresignedUrl, uploadFile } from "@/lib/storage";

const verifyVoiceOwnership = async (voiceId: string, userId: string) => {
  logger.info("verifyVoiceOwnership: voiceId", { voiceId, userId });
  const voice = await prisma.voice.findFirst({
    where: {
      id: voiceId,
      AND: {
        userId: userId,
      },
    },
  });

  if (!voice) {
    logger.error("Voice Not Found", {
      voiceId,
      userId,
    });
    throw new NotFoundException("Voice not found");
  }
};

export const createVoiceSampleService = async (
  file: Express.Multer.File,
  voiceId: string,
  userId: string,
) => {
  await verifyVoiceOwnership(voiceId, userId);

  if (!file) {
    logger.error("No File Uploaded", {
      userId,
      voiceId,
    });
    throw new NotFoundException("No File Uploaded");
  }

  const { originalname, buffer, mimetype } = file;

  if (!ALLOWED_MIME_TYPES.includes(mimetype as (typeof ALLOWED_MIME_TYPES)[number])) {
    logger.error("Invalid File Type", {
      userId,
      voiceId,
      mimetype,
    });
    throw new BadRequestException(
      `Invalid File Type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
    );
  }

  const storagePath = `voices/${voiceId}/${randomUUID()}-${originalname}`;
  const sizeBytes = buffer.length;

  await uploadFile(storagePath, buffer, file.mimetype);

  const voiceSample = await prisma.voiceSample.create({
    data: {
      voiceId,
      fileName: originalname,
      mimeType: mimetype,
      sizeBytes,
      storagePath,
    },
  });

  return voiceSample;
};

export const listAllUserVoiceSamplesService = async (voiceId: string, userId: string) => {
  await verifyVoiceOwnership(voiceId, userId);

  const voiceSamples = await prisma.voiceSample.findMany({
    where: {
      voiceId,
    },
  });

  return voiceSamples;
};

export const getVoiceSampleByIdService = async (
  voiceId: string,
  userId: string,
  voiceSampleId: string,
) => {
  await verifyVoiceOwnership(voiceId, userId);

  const voiceSample = await prisma.voiceSample.findUnique({
    where: {
      id: voiceSampleId,
      AND: {
        voiceId,
      },
    },
  });

  if (!voiceSample) {
    logger.error("Voice Sample Not Found", {
      voiceSampleId,
      userId,
    });
    throw new NotFoundException("Voice Sample not found");
  }

  const downloadUrl = await getPresignedUrl(voiceSample.storagePath);

  return {
    ...voiceSample,
    downloadUrl,
  };
};

export const deleteVoiceSampleByIdService = async (
  voiceId: string,
  userId: string,
  voiceSampleId: string,
) => {
  await verifyVoiceOwnership(voiceId, userId);

  const voiceSample = await prisma.voiceSample.findFirst({
    where: {
      id: voiceSampleId,
      AND: {
        voiceId,
      },
    },
  });

  if (!voiceSample) {
    logger.error("Voice Sample Not Found", {
      voiceSampleId,
      userId,
    });
    throw new NotFoundException("Voice Sample not found");
  }

  await deleteFile(voiceSample.storagePath);
  await prisma.voiceSample.delete({
    where: {
      id: voiceSampleId,
    },
  });

  return voiceSample;
};
