import { config } from "dotenv";
config({ path: "../../.env" });

import { prisma } from "@repo/db";
import { createLogger } from "@repo/common";
import { VoiceCategoryEnum, VoiceGenderEnum } from "@prisma/client";

const logger = createLogger({ name: "db-seed" });

async function main() {
  logger.info("Seeding...");

  await prisma.$transaction([
    prisma.voice.deleteMany({
      where: { category: VoiceCategoryEnum.PREMADE, userId: null },
    }),
    prisma.voice.createMany({
      data: [
        {
          name: "Heart",
          description: "A warm, expressive American female voice",
          category: VoiceCategoryEnum.PREMADE,
          language: "en",
          gender: VoiceGenderEnum.FEMALE,
          accent: "american",
          isPublic: true,
          metadata: { engine: "kokoro", kokoroVoice: "af_heart" },
        },
        {
          name: "Bella",
          description: "A smooth, friendly American female voice",
          category: VoiceCategoryEnum.PREMADE,
          language: "en",
          gender: VoiceGenderEnum.FEMALE,
          accent: "american",
          isPublic: true,
          metadata: { engine: "kokoro", kokoroVoice: "af_bella" },
        },
        {
          name: "Adam",
          description: "A deep, confident American male voice",
          category: VoiceCategoryEnum.PREMADE,
          language: "en",
          gender: VoiceGenderEnum.MALE,
          accent: "american",
          isPublic: true,
          metadata: { engine: "kokoro", kokoroVoice: "am_adam" },
        },
        {
          name: "Alice",
          description: "A refined, elegant British female voice",
          category: VoiceCategoryEnum.PREMADE,
          language: "en",
          gender: VoiceGenderEnum.FEMALE,
          accent: "british",
          isPublic: true,
          metadata: { engine: "kokoro", kokoroVoice: "bf_alice" },
        },
        {
          name: "George",
          description: "A classic, distinguished British male voice",
          category: VoiceCategoryEnum.PREMADE,
          language: "en",
          gender: VoiceGenderEnum.MALE,
          accent: "british",
          isPublic: true,
          metadata: { engine: "kokoro", kokoroVoice: "bm_george" },
        },
      ],
    }),
  ]);

  logger.info("Seed complete");
}

main()
  .catch((err) => {
    logger.error("Seed failed", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
