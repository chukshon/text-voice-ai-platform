import { prisma } from "@repo/db";
import { logger } from "@/utils/logger";
import { NotFoundException } from "@repo/common";
import { CreateTTSJobInputT } from "@/validators/tts-job.validator";
import { publishJob } from "@/lib/queue";

export const createTTSJobService = async (payload: CreateTTSJobInputT, userId: string) => {
  const voice = await prisma.voice.findFirst({
    where: {
      id: payload.voiceId,
      AND: {
        OR: [{ isPublic: true }, { userId }],
      },
    },
  });

  if (!voice) {
    logger.error("Voice not found", { voiceId: payload.voiceId });
    throw new NotFoundException("Voice not found");
  }
  const createdJob = await prisma.voiceJob.create({
    data: {
      ...payload,
      userId,
      voiceId: payload.voiceId,
    },
    select: {
      id: true,
      status: true,
      type: true,
      voiceId: true,
      createdAt: true,
    },
  });

  logger.info("Job created successfully", { jobId: createdJob.id });

  await publishJob({
    jobId: createdJob.id,
    voiceId: createdJob.voiceId,
    text: payload.text,
    outputFormat: payload.outputFormat,
  });
  return createdJob;
};
