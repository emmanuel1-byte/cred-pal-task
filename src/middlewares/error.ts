import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { ZodError } from "zod";
import createHttpError from "http-errors";

export function routeNotFoundErrorHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(404).json({
    success: false,
    message: "The requested endpoint does not exist",
  });
  next();
}

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (createHttpError.isHttpError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  const isProduction = process.env.NODE_ENV === "production";

  return res.status(500).json({
    success: false,
    message: isProduction ? "Internal server error" : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
