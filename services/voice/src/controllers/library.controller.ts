import { RequestHandler } from "express";
import { asyncHandler, HTTPSTATUS, ValidatedRequest } from "@repo/common";
import { ListAllVoicesQueryT } from "@/validators/library";
import { listAllVoicesService, FiltersT, getVoiceByIdService } from "@/services/library.service";
import { PaginationT } from "@/types/index";

export const listAllVoicesHandler: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const validatedQuery = (req as ValidatedRequest).validatedQuery as
    | Partial<ListAllVoicesQueryT>
    | undefined;

  const filters: FiltersT = {
    searchKeyword: validatedQuery?.searchKeyword,
    language: validatedQuery?.language,
    gender: validatedQuery?.gender,
    category: validatedQuery?.category,
  };

  const pagination: PaginationT = {
    pageNumber: validatedQuery?.pageNumber ?? 1,
    limit: validatedQuery?.limit ?? 20,
  };

  const allUserVoices = await listAllVoicesService(userId, filters, pagination);

  res.status(HTTPSTATUS.CREATED).json({
    success: true,
    data: allUserVoices,
  });
});

export const getVoiceByIdHandler: RequestHandler = asyncHandler(async (req, res) => {
  const voiceId = req.params.id as string;

  const voice = await getVoiceByIdService(voiceId);

  res.status(HTTPSTATUS.OK).json({
    success: true,
    data: voice,
  });
});
