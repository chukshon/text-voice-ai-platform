import { createApp } from "@/app";
import { createServer } from "http";
import { env } from "@/config/env";
import { prisma } from "@repo/db";
import { logger } from "@/utils/logger";

const main = async () => {
  try {
    await prisma.$connect();

    const app = createApp();
    const server = createServer(app);

    const port = env.AUTH_SERVICE_PORT;

    server.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });

    const shutdown = () => {
      logger.info("Shutting down server...");

      Promise.all([prisma.$disconnect()])
        .catch((error) => {
          logger.error("Failed to shut down server", error);
          process.exit(1);
        })
        .finally(() => {
          logger.info("Server shutdown complete");
          process.exit(0);
        });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

void main();
