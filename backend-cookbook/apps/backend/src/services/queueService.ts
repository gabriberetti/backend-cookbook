import { Queue, Worker, Job } from 'bullmq';
import { config } from '../config';
import { eventService } from './eventService';

const connection = { url: config.redis.url } as const;

export const emailQueue = new Queue('email', { connection });
export const fileProcessingQueue = new Queue('file-processing', { connection });

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  userId?: string;
  traceId: string;
}

export interface FileProcessingJobData {
  fileKey: string;
  userId: string;
  traceId: string;
}

export function startWorkers(): void {
  new Worker<EmailJobData>(
    'email',
    async (job: Job<EmailJobData>) => {
      console.log(`[Worker] Processing email job ${job.id} → ${job.data.to}`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      await eventService.log({
        traceId: job.data.traceId,
        eventType: 'job',
        level: 'info',
        message: `Email sent to ${job.data.to}`,
        stage: 'email-worker',
        userId: job.data.userId,
        meta: { jobId: job.id, subject: job.data.subject },
      });
    },
    { connection }
  );

  new Worker<FileProcessingJobData>(
    'file-processing',
    async (job: Job<FileProcessingJobData>) => {
      console.log(`[Worker] Processing file job ${job.id} → ${job.data.fileKey}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await eventService.log({
        traceId: job.data.traceId,
        eventType: 'job',
        level: 'info',
        message: `File processed: ${job.data.fileKey}`,
        stage: 'file-worker',
        userId: job.data.userId,
        meta: { jobId: job.id, fileKey: job.data.fileKey },
      });
    },
    { connection }
  );

  console.log('[Workers] Email and file-processing workers started');
}
