import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ResponseUtil } from '../utils/response';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(`Operational Error: ${err.message}`, {
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    return res.status(err.statusCode).json(ResponseUtil.error(err.message, String(err.statusCode)));
  }

  logger.error(`Unexpected Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = 500;
  const message = process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';

  return res.status(statusCode).json(
    ResponseUtil.error(message, String(statusCode), {
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
  );
};

export const notFoundHandler = (req: Request, res: Response) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn(message, { method: req.method, path: req.path });

  res.status(404).json(ResponseUtil.error(message, '404'));
};
