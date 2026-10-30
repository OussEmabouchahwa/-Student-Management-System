import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/app-error";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(AppError.notFound(`Endpoint ${req.method} ${req.path} not found.`));
}
