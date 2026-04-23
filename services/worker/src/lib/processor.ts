import { randomUUID } from "node:crypto";
import { uploadFile } from "@/lib/storage";
import { prisma } from "@repo/db";
import { JobStatusEnum } from "@repo/db";
import { logger } from "@/utils/logger";
import { ALLOWED_OUTPUT_ENUM, ALLOWED_MIME_TYPES_ENUM } from "@/constants";
import { synthesizeSpeechService } from "@/lib/tts-client";

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

    // 2. Look up voice metadata to get the Kokoro voice ID
    const voice = await prisma.voice.findFirst({
      where: {
        id: voiceId,
      },
    });

    const kokoroVoice =
      ((voice?.metadata as Record<string, unknown>)?.kokoroVoice as string) || "af_heart";

    // 3. Call the real TTS service
    const SynthesizeResponse = await synthesizeSpeechService({
      text,
      voice_id: kokoroVoice,
      language: voice?.language || "en",
      output_format: outputFormat || "wav",
    });

    const mimeType =
      outputFormat === ALLOWED_OUTPUT_ENUM.WAV
        ? ALLOWED_MIME_TYPES_ENUM.WAV
        : ALLOWED_MIME_TYPES_ENUM.MP3;
    const ext =
      outputFormat === ALLOWED_OUTPUT_ENUM.WAV ? ALLOWED_OUTPUT_ENUM.WAV : ALLOWED_OUTPUT_ENUM.MP3;

    const fileName = `tts-${jobId.slice(0, 8)}.${ext}`;
    const storagePath = `tts/${voiceId}/${randomUUID()}-${fileName}`;

    await uploadFile(storagePath, SynthesizeResponse.audioBuffer, mimeType);

    const audioFile = await prisma.audioFile.create({
      data: {
        jobId,
        fileName,
        mimeType,
        sizeBytes: SynthesizeResponse.audioBuffer.length,
        storagePath,
        durationMs: SynthesizeResponse.durationMs,
      },
    });

    await prisma.voiceJob.update({
      where: { id: jobId },
      data: { outputFileId: audioFile.id, status: JobStatusEnum.COMPLETED, updatedAt: new Date() },
    });

    logger.info(`[processor] Job ${jobId} completed successfully`, {
      jobId,
      voiceId,
      durationMs: SynthesizeResponse.durationMs,
    });
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
