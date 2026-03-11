import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      traceId: string;
      startTime: number;
    }
  }
}

export function traceIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const traceId = (req.headers['x-trace-id'] as string) ?? uuidv4();
  req.traceId = traceId;
  req.startTime = Date.now();
  res.setHeader('X-Trace-ID', traceId);
  next();
}
