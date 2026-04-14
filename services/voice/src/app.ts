import express, { type Application } from "express";
import { errorHandlerMiddleware } from "@repo/common";
import helmet from "helmet";

export const createApp = (): Application => {
  const app = express();

  app.use(helmet());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // registerRoutes(app);

  app.use(errorHandlerMiddleware);

  return app;
};
