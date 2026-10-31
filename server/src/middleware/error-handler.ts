import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/app-error";
import { logger } from "../lib/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    const responsePayload: {
      error: {
        code: string;
        message: string;
        fields?: Record<string, string>;
      };
    } = {
      error: {
        code: err.code,
        message: err.message,
      },
    };

    if (err.fields && Object.keys(err.fields).length > 0) {
      responsePayload.error.fields = err.fields;
    }

    res.status(err.statusCode).json(responsePayload);
    return;
  }

  logger.error({ err }, "Unhandled application error");

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred. Please try again later.",
    },
  });
}
