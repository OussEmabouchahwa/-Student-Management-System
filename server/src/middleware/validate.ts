import { Request, Response, NextFunction } from "express";
import { ZodType, ZodTypeDef, ZodError } from "zod";
import { AppError } from "../lib/app-error";

export function validateBody<TOutput, TInput = unknown>(
  schema: ZodType<TOutput, ZodTypeDef, TInput>
) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        for (const issue of error.issues) {
          const path = issue.path.join(".") || "body";
          if (!fields[path]) {
            fields[path] = issue.message;
          }
        }
        next(AppError.badRequest("Check the highlighted fields.", fields));
        return;
      }
      next(error);
    }
  };
}

export function validateQuery<TOutput, TInput = unknown>(
  schema: ZodType<TOutput, ZodTypeDef, TInput>
) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.query);
      req.query = parsed as unknown as Request["query"];
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        for (const issue of error.issues) {
          const path = issue.path.join(".") || "query";
          if (!fields[path]) {
            fields[path] = issue.message;
          }
        }
        next(AppError.badRequest("Invalid query parameters.", fields));
        return;
      }
      next(error);
    }
  };
}

export function validateParams<TOutput, TInput = unknown>(
  schema: ZodType<TOutput, ZodTypeDef, TInput>
) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = (await schema.parseAsync(req.params)) as unknown as Request["params"];
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        for (const issue of error.issues) {
          const path = issue.path.join(".") || "params";
          if (!fields[path]) {
            fields[path] = issue.message;
          }
        }
        next(AppError.badRequest("Invalid route parameters.", fields));
        return;
      }
      next(error);
    }
  };
}
