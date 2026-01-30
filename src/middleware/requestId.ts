import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const id = req.headers['x-request-id'] as string || uuidv4();
  (req as any).id = id;

  res.setHeader('X-Request-ID', id);

  const originalSend = res.send;
  res.send = function (body) {
    if (!res.headersSent) {
      res.setHeader('X-Request-ID', id);
    }
    return originalSend.call(this, body);
  };

  logger.info('Incoming request', {
    requestId: id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  next();
};
