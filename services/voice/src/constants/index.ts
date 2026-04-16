export const ALLOWED_MIME_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/flac",
  "audio/mp4",
  "audio/webm",
] as const;

export const MAX_AUDIO_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export const MULTER_AUDIO_FILE_ERROR_MESSAGES = {
  LIMIT_UNEXPECTED_FILE: "Invalid audio file field type. Expected 'file' or 'files'.",
  LIMIT_FILE_SIZE: "Audio file size exceeds the maximum limit",
  LIMIT_FILE_COUNT: "Total number of audio files exceeds the maximum limit",
  default: "Audio file upload error. Please try again.",
};
