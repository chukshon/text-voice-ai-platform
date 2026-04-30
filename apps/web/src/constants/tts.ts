export enum TTS_SPEEDS {
  SLOW = 0.5,
  MEDIUM = 0.75,
  NORMAL = 1,
  FAST = 1.25,
  FASTER = 1.5,
  FASTEST = 2,
}
export const SPEEDS = [
  TTS_SPEEDS.SLOW,
  TTS_SPEEDS.MEDIUM,
  TTS_SPEEDS.NORMAL,
  TTS_SPEEDS.FAST,
  TTS_SPEEDS.FASTER,
  TTS_SPEEDS.FASTEST,
];

export enum JobStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum JobType {
  TTS = "tts",
  CLONE = "clone",
}

export enum ALLOWED_OUTPUT_ENUM {
  WAV = "wav",
  MP3 = "mp3",
  OGG = "ogg",
  FLAC = "flac",
  MP4 = "mp4",
  WEBM = "webm",
}
