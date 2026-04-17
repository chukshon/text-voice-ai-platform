import { randomUUID } from "node:crypto";
import { uploadFile } from "@/lib/storage";
import { prisma } from "@repo/db";
import { JobStatusEnum } from "@repo/db";
import { logger } from "@/utils/logger";
import { ALLOWED_OUTPUT_ENUM, ALLOWED_MIME_TYPES_ENUM } from "@/constants";

interface JobMessage {
  jobId: string;
  voiceId: string;
  text: string;
  outputFormat: string;
}

export async function processTTSJob(message: Record<string, unknown>) {
  const { jobId, voiceId, text, outputFormat } = message as unknown as JobMessage;

  await prisma.voiceJob.update({
    where: { id: jobId },
    data: { status: JobStatusEnum.PROCESSING, updatedAt: new Date() },
  });

  try {
    // Mock TTS - generate a tiny Silent WAV file to be replaced with a real tts engine.
    logger.info(`[processor] Processing job ${jobId}: ${text.slice(0, 50)}...`);
    const buffer = generateSilentWav(1);

    const mimeType =
      outputFormat === ALLOWED_OUTPUT_ENUM.WAV
        ? ALLOWED_MIME_TYPES_ENUM.WAV
        : ALLOWED_MIME_TYPES_ENUM.MP3;
    const ext =
      outputFormat === ALLOWED_OUTPUT_ENUM.WAV ? ALLOWED_OUTPUT_ENUM.WAV : ALLOWED_OUTPUT_ENUM.MP3;

    const fileName = `tts-${jobId.slice(0, 8)}.${ext}`;
    const storagePath = `tts/${voiceId}/${randomUUID()}-${fileName}`;

    await uploadFile(storagePath, buffer, mimeType);

    const audioFile = await prisma.audioFile.create({
      data: {
        jobId,
        fileName,
        mimeType,
        sizeBytes: buffer.length,
        storagePath,
      },
    });

    await prisma.voiceJob.update({
      where: { id: jobId },
      data: { outputFileId: audioFile.id, status: JobStatusEnum.COMPLETED, updatedAt: new Date() },
    });

    logger.info(`[processor] Job ${jobId} completed successfully`);
  } catch (error) {
    await prisma.voiceJob.update({
      where: { id: jobId },
      data: {
        status: JobStatusEnum.FAILED,
        error: error instanceof Error ? error.message : "Unknown error",
        updatedAt: new Date(),
      },
    });
    logger.error(
      `[processor] Job ${jobId} failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    throw error;
  }
}

// Generate a minimal WAV file with silence, this is a placeholder until we add
// a real TTS engine.
function generateSilentWav(durationSeconds: number): Buffer {
  const sampleRate = 22050;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = sampleRate * durationSeconds;
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const headerSize = 44;

  const buffer = Buffer.alloc(headerSize + dataSize);

  //   RIFF Header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  //   fmt Chuck
  buffer.write("fmt", 12);
  buffer.writeUInt32BE(16, 16);
  buffer.writeUInt16BE(1, 20);
  buffer.writeUInt16BE(numChannels, 22);
  buffer.writeUInt16BE(sampleRate, 24);
  buffer.writeUInt16BE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16BE(numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16BE(bitsPerSample, 34);

  //   Data Chunk
  buffer.write("data", 36);
  buffer.writeUInt32BE(dataSize, 40);

  return buffer;
}
