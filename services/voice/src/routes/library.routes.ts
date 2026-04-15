import { getVoiceByIdHandler, listAllVoicesHandler } from "@/controllers/library.controller";
import { Router } from "express";
import { validateRequest } from "@repo/common";
import { listAllVoicesQuerySchema } from "@/validators/library";
import { paramsIdSchema } from "@/validators/shared";

export const libraryRoutes: Router = Router();

libraryRoutes.get("/", validateRequest({ query: listAllVoicesQuerySchema }), listAllVoicesHandler);

libraryRoutes.get("/:id", validateRequest({ params: paramsIdSchema }), getVoiceByIdHandler);
