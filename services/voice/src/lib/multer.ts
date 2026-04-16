import multer from "multer";
import { MAX_AUDIO_FILE_SIZE_BYTES } from "@/constants";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AUDIO_FILE_SIZE_BYTES },
});
