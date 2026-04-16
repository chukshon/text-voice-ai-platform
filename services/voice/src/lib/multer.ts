import multer, { MulterError } from "multer";
import { MAX_AUDIO_FILE_SIZE_BYTES, MULTER_AUDIO_FILE_ERROR_MESSAGES } from "@/constants";
import { HTTPSTATUS } from "@repo/common";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AUDIO_FILE_SIZE_BYTES },
});

export const handleMulterAudioFileError = (err: MulterError) => {
  return {
    status: HTTPSTATUS.BAD_REQUEST,
    message:
      MULTER_AUDIO_FILE_ERROR_MESSAGES[err.code as keyof typeof MULTER_AUDIO_FILE_ERROR_MESSAGES] ||
      MULTER_AUDIO_FILE_ERROR_MESSAGES.default,
    error: err.message,
  };
};
