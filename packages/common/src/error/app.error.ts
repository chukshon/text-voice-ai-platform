import { HttpStatusCodeType } from "../constants/http-status-code.js";

export class AppError extends Error {
  public statusCode: HttpStatusCodeType;
  public errorCode?: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: HttpStatusCodeType,
    errorCode?: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
