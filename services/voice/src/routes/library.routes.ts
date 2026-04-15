import { listAllVoicesHandler } from "@/controllers/library.controller";
import { Router } from "express";
import { validateRequest } from "@repo/common";
import { listAllVoicesQuerySchema } from "@/validators/library";

export const libraryRoutes: Router = Router();

libraryRoutes.get("/", validateRequest({ query: listAllVoicesQuerySchema }), listAllVoicesHandler);
