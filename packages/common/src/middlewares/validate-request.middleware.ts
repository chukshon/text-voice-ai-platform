import { UnprocessableEntityException } from "../error/exceptions.js";
import type { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError, ZodTypeAny } from "zod";

type Schema = AnyZodObject | ZodTypeAny;
type ParamsRecord = Record<string, string>;
type QueryRecord = Record<string, unknown>;

export interface RequestValidatonSchema {
  body?: Schema;
  params?: Schema;
  query?: Schema;
}

const formattedError = (error: ZodError) => {
  return error.errors.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

export type ValidatedRequest = Request & { validatedQuery?: QueryRecord };

export const validateRequest = (schema: RequestValidatonSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        const parsedBody = schema.body.parse(req.body) as unknown;
        req.body = parsedBody;
      }
      if (schema.params) {
        const parsedParams = schema.params.parse(req.params) as ParamsRecord;
        req.params = parsedParams as Request["params"];
      }
      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query) as QueryRecord;
        (req as ValidatedRequest).validatedQuery = parsedQuery;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new UnprocessableEntityException("Validation Error", "VALIDATION_ERROR", {
            errors: formattedError(error),
          }),
        );
        return;
      }

      next(error);
    }
  };
};
