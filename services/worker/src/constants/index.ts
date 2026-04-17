export enum ALLOWED_OUTPUT_ENUM {
  WAV = "wav",
  MP3 = "mp3",
  OGG = "ogg",
  FLAC = "flac",
  MP4 = "mp4",
  WEBM = "webm",
}

export enum ALLOWED_MIME_TYPES_ENUM {
  MP3 = "audio/mpeg",
  WAV = "audio/wav",
  OGG = "audio/ogg",
  FLAC = "audio/flac",
  MP4 = "audio/mp4",
  WEBM = "audio/webm",
}
export const ALLOWED_MIME_TYPES = [
  ALLOWED_MIME_TYPES_ENUM.MP3,
  ALLOWED_MIME_TYPES_ENUM.WAV,
  ALLOWED_MIME_TYPES_ENUM.OGG,
  ALLOWED_MIME_TYPES_ENUM.FLAC,
  ALLOWED_MIME_TYPES_ENUM.MP4,
  ALLOWED_MIME_TYPES_ENUM.WEBM,
] as const satisfies (typeof ALLOWED_MIME_TYPES_ENUM)[keyof typeof ALLOWED_MIME_TYPES_ENUM][];
