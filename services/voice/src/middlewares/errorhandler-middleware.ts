import { handleMulterAudioFileError } from "@/lib/multer";
import { errorHandlerMiddleware as commonErrorHandlerMiddleware } from "@repo/common";
import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";

export const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof MulterError) {
    const { status, message, error } = handleMulterAudioFileError(err);
    return res.status(status).json({
      message,
      error,
    });
  }
  return commonErrorHandlerMiddleware(err, req, res, next);
};
