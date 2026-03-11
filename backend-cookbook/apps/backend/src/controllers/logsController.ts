import { Request, Response, NextFunction } from 'express';
import { Log } from '../models/Log';
import { eventService } from '../services/eventService';

export const logsController = {
  async getLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventType, level, traceId, limit = '50' } = req.query;

      const filter: Record<string, unknown> = {};
      if (eventType) filter.eventType = eventType;
      if (level) filter.level = level;
      if (traceId) filter.traceId = traceId;

      const logs = await Log.find(filter)
        .sort({ timestamp: -1 })
        .limit(Math.min(parseInt(limit as string, 10), 200));

      res.json({ success: true, data: { logs }, traceId: req.traceId });
    } catch (err) {
      next(err);
    }
  },

  async simulateError(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type } = req.body as { type: string };

      const simulations: Record<string, () => Promise<void>> = {
        'db-timeout': async () => {
          await eventService.log({
            traceId: req.traceId,
            eventType: 'error',
            level: 'error',
            message: 'MongoDB connection timeout simulated',
            stage: 'db-connection',
            meta: { simulated: true, retryAttempts: 3 },
          });
        },
        'auth-failure': async () => {
          await eventService.log({
            traceId: req.traceId,
            eventType: 'error',
            level: 'warn',
            message: 'Authentication failure simulated',
            stage: 'auth-middleware',
            meta: { simulated: true, reason: 'invalid-token' },
          });
        },
        'rate-limit': async () => {
          await eventService.log({
            traceId: req.traceId,
            eventType: 'error',
            level: 'warn',
            message: 'Rate limit triggered simulated',
            stage: 'rate-limiter',
            meta: { simulated: true, limit: 100 },
          });
        },
        's3-error': async () => {
          await eventService.log({
            traceId: req.traceId,
            eventType: 'error',
            level: 'error',
            message: 'S3 upload failure simulated',
            stage: 's3-upload',
            meta: { simulated: true, fallback: 'local-storage' },
          });
        },
      };

      const simulate = simulations[type];
      if (!simulate) {
        res.status(400).json({ success: false, message: 'Unknown simulation type' });
        return;
      }

      await simulate();

      res.json({
        success: true,
        message: `Simulated: ${type}`,
        traceId: req.traceId,
      });
    } catch (err) {
      next(err);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [total, byType, recentErrors] = await Promise.all([
        Log.countDocuments(),
        Log.aggregate([
          { $group: { _id: '$eventType', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        Log.find({ level: 'error' }).sort({ timestamp: -1 }).limit(5),
      ]);

      res.json({
        success: true,
        data: { total, byType, recentErrors },
        traceId: req.traceId,
      });
    } catch (err) {
      next(err);
    }
  },
};
