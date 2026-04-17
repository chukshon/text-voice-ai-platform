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
