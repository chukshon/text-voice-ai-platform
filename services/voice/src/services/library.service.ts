import { ListAllVoicesQueryT } from "@/validators/library";
import { PaginationT } from "@/types/index";
import { prisma } from "@repo/db";
import { logger } from "@/utils/logger";
import { NotFoundException } from "@repo/common";

export type FiltersT = Omit<ListAllVoicesQueryT, "pageNumber" | "limit">;

export const listAllVoicesService = async (filters: FiltersT, pagination: PaginationT) => {
  const { pageNumber, limit: pageLimit } = pagination;

  const page = Math.max(1, Number(pageNumber) || 1);
  const limit = Math.min(100, Math.max(1, Number(pageLimit) || 20));
  const skip = (page - 1) * limit;

  const { searchKeyword, category, gender, language } = filters;
  const filterConditions: Record<string, any> = {};

  if (searchKeyword) {
    const keyword = searchKeyword.trim();
    const normalized = keyword.toUpperCase();
    const orConditions: Record<string, any>[] = [
      {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      {
        language: {
          contains: keyword,
          mode: "insensitive",
        },
      },
    ];
    // Enums don't support `contains`, only exact matches
    if (["PREMADE", "CUSTOM", "CLONED"].includes(normalized)) {
      orConditions.push({ category: normalized });
    }
    if (["MALE", "FEMALE", "NEUTRAL"].includes(normalized)) {
      orConditions.push({ gender: normalized });
    }
    filterConditions.OR = orConditions;
  }

  if (category) {
    filterConditions.category = category;
  }
  if (gender) {
    filterConditions.gender = gender;
  }

  if (language) {
    filterConditions.language = language;
  }

  const [voices, totalCount] = await Promise.all([
    prisma.voice.findMany({
      where: {
        ...filterConditions,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.voice.count({
      where: {
        ...filterConditions,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    voices,
    pagination: {
      totalCount,
      totalPages,
      pageNumber,
      pageSize: limit,
      skip,
    },
  };
};

export const getVoiceByIdService = async (voiceId: string) => {
  const voice = await prisma.voice.findFirst({
    where: {
      id: voiceId,
      AND: {
        isPublic: true,
      },
    },
  });

  if (!voice) {
    logger.error("Voice Not Found", {
      voiceId,
    });
    throw new NotFoundException("Voice not found");
  }

  return voice;
};
