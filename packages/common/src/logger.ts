import winston from "winston";
import type { LoggerOptions, Logger } from "winston";

type CreateLoggerOptions = Omit<LoggerOptions, "transports" | "format" | "defaultMeta"> & {
  name: string;
};

export function createLogger(options: CreateLoggerOptions): Logger {
  const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;
  const { name, ...rest } = options;

  const isProd = process.env.NODE_ENV === "production";

  const devFormat = combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    align(),
    printf(({ timestamp, level, message, ...meta }) => {
      const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : "";
      return `${timestamp} [${name}] ${level}: ${message}${metaString}`;
    }),
  );

  const prodFormat = combine(timestamp(), errors({ stack: true }), json());

  return winston.createLogger({
    level: process.env.LOG_LEVEL ?? "info",
    silent: process.env.NODE_ENV === "test",
    defaultMeta: { service: name },
    format: isProd ? prodFormat : devFormat,
    transports: [new winston.transports.Console()],
    ...rest,
  });
}
