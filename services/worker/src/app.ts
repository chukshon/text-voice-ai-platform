import express, { type Application } from "express";
import { errorHandlerMiddleware } from "@repo/common";
import helmet from "helmet";
import { registerRoutes } from "@/routes";
import cors from "cors";
import { env } from "./config/env";

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: [env.FRONTEND_URL],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: false,
    }),
  );

  registerRoutes(app);

  app.use(errorHandlerMiddleware);

  return app;
};
