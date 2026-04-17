import { createLogger } from "@repo/common";
import type { Logger } from "@repo/common";

export const logger: Logger = createLogger({
  name: "worker-service",
});
