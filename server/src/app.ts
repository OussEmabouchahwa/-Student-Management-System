import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { studentsRouter } from "./modules/students/students.routes";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS restriction
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // Request body size limit
  app.use(express.json({ limit: "10kb" }));

  // Observability
  if (process.env.NODE_ENV !== "test") {
    app.use(
      pinoHttp({
        logger,
        genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
        customLogLevel: (_req, res, err) => {
          if (res.statusCode >= 500 || err) return "error";
          if (res.statusCode >= 400) return "warn";
          return "info";
        },
      })
    );
  }

  // Rate limiting for API router
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test",
  });

  // Base API routes
  const apiRouter = express.Router();
  apiRouter.use(limiter);

  apiRouter.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  apiRouter.use("/students", studentsRouter);

  app.use("/api/v1", apiRouter);

  // Fallbacks
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
