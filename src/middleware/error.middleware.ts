import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors';
import { sendError } from '../utils/response';
import { logger } from '../lib/logger';
import { config } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`Error processing ${req.method} ${req.path}: ${err.message}`, err);

  // 1. Handled AppError
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errorCode, err.details);
  }

  // 2. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 'Validation error in request parameters', 422, 'VALIDATION_ERROR', formattedErrors);
  }

  // 3. JSON Syntax parsing error
  if ('type' in err && (err as any).type === 'entity.parse.failed') {
    return sendError(res, 'Malformed JSON payload provided', 400, 'INVALID_JSON');
  }

  // 4. Default unhandled internal server error (never leak internal details in production)
  const message = config.NODE_ENV === 'development' ? err.message : 'An unexpected server error occurred.';
  return sendError(res, message, 500, 'INTERNAL_SERVER_ERROR');
};
