import { JobStatusEnum, prisma } from "@repo/db";
import { logger } from "@/utils/logger";
import { NotFoundException } from "@repo/common";
import { CreateTTSJobInputT } from "@/validators/tts-job.validator";
import { publishJob } from "@/lib/queue";
import { getPresignedUrl } from "@/lib/storage";

export const createTTSJobService = async (payload: CreateTTSJobInputT, userId: string) => {
  const voice = await prisma.voice.findFirst({
    where: {
      id: payload.voiceId,
      AND: {
        OR: [{ isPublic: true }, { userId }],
      },
    },
  });

  logger.info("Voice found", { voice });

  if (!voice) {
    logger.error("Voice not found", { voiceId: payload.voiceId });
    throw new NotFoundException("Voice not found");
  }
  const createdJob = await prisma.voiceJob.create({
    data: {
      voiceId: payload.voiceId,
      inputText: payload.text,
      metadata: { outputFormat: payload.outputFormat },
      userId,
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

export const getTTSJobByIdService = async (id: string, userId: string) => {
  const job = await prisma.voiceJob.findUnique({
    where: {
      id,
      AND: { userId },
    },
  });

  if (!job) {
    logger.error("Job not found", { id });
    throw new NotFoundException("Job not found");
  }

  let audioFile = null;
  let downloadUrl = null;

  if (job.status === JobStatusEnum.COMPLETED) {
    audioFile = await prisma.audioFile.findUnique({
      where: { id: job.outputFileId as string },
    });
    if (audioFile) {
      downloadUrl = await getPresignedUrl(audioFile.storagePath);
    }
  }

  return {
    job,
    audioFile,
    downloadUrl,
  };
};

export const listTTSJobsService = async (userId: string, pageNumber?: number, limit?: number) => {
  const page = Math.max(1, Number(pageNumber) || 1);

  const pageLimit = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * pageLimit;

  const [jobs, totalCount] = await Promise.all([
    prisma.voiceJob.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        type: true,
        voiceId: true,
        inputText: true,
        error: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: pageLimit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.voiceJob.count({
      where: { userId },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageLimit);

  return {
    jobs,
    pagination: {
      totalCount,
      totalPages,
      pageNumber,
      pageSize: pageLimit,
    },
  };
};
