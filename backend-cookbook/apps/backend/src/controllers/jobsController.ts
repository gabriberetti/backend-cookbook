import { Request, Response, NextFunction } from 'express';
import { emailQueue, fileProcessingQueue } from '../services/queueService';
import { eventService } from '../services/eventService';

export const jobsController = {
  async triggerEmailJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { to, subject, body } = req.body as {
        to: string;
        subject: string;
        body: string;
      };

      const job = await emailQueue.add('send-email', {
        to,
        subject,
        body,
        userId: req.user!.userId,
        traceId: req.traceId,
      });

      await eventService.log({
        traceId: req.traceId,
        eventType: 'job',
        level: 'info',
        message: `Email job queued: ${to}`,
        stage: 'queue-producer',
        userId: req.user!.userId,
        meta: { jobId: job.id, queue: 'email' },
      });

      res.status(201).json({
        success: true,
        message: 'Email job queued',
        data: { jobId: job.id },
        traceId: req.traceId,
      });
    } catch (err) {
      next(err);
    }
  },

  async getJobStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;

      const emailJob = await emailQueue.getJob(id);
      const fileJob = await fileProcessingQueue.getJob(id);
      const job = emailJob ?? fileJob;

      if (!job) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }

      const state = await job.getState();

      res.json({
        success: true,
        data: {
          id: job.id,
          name: job.name,
          state,
          progress: job.progress,
          data: job.data,
          createdAt: new Date(job.timestamp),
          processedAt: job.processedOn ? new Date(job.processedOn) : null,
          finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
        },
        traceId: req.traceId,
      });
    } catch (err) {
      next(err);
    }
  },
};
