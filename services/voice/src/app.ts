import express, { type Application } from "express";
import { errorHandlerMiddleware } from "@/middlewares/errorhandler-middleware";
import helmet from "helmet";
import { registerRoutes } from "@/routes";
import cors from "cors";

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: false,
    }),
  );

  registerRoutes(app);

  app.use(errorHandlerMiddleware);

  return app;
};
