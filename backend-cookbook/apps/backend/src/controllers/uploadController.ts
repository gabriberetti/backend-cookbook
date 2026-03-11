import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { s3Service } from '../services/s3Service';
import { eventService } from '../services/eventService';
import { fileProcessingQueue } from '../services/queueService';
import { AppError } from '../middleware/errorHandler';

export const uploadController = {
  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) throw new AppError(400, 'No file provided', 'NO_FILE');

      const ext = path.extname(req.file.originalname);
      const key = `uploads/${req.user!.userId}/${uuidv4()}${ext}`;

      const result = await s3Service.upload(key, req.file.buffer, req.file.mimetype);

      await fileProcessingQueue.add('process-file', {
        fileKey: key,
        userId: req.user!.userId,
        traceId: req.traceId,
      });

      await eventService.log({
        traceId: req.traceId,
        eventType: 'cloud',
        level: 'info',
        message: `File uploaded to S3: ${key}`,
        method: 'POST',
        path: '/upload',
        stage: 's3-upload',
        userId: req.user!.userId,
        meta: { key, size: req.file.size, contentType: req.file.mimetype },
      });

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: { file: result },
        traceId: req.traceId,
      });
    } catch (err) {
      next(err);
    }
  },

  async listFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const prefix = `uploads/${req.user!.userId}/`;
      const files = await s3Service.list(prefix);

      res.json({ success: true, data: { files }, traceId: req.traceId });
    } catch (err) {
      next(err);
    }
  },

  async getPresignedUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const key = req.params['key'] as string;

      if (!key.startsWith(`uploads/${req.user!.userId}/`)) {
        throw new AppError(403, 'Access denied', 'ACCESS_DENIED');
      }

      const url = await s3Service.getPresignedUrl(decodeURIComponent(key), 3600);
      res.json({ success: true, data: { url, expiresIn: 3600 }, traceId: req.traceId });
    } catch (err) {
      next(err);
    }
  },
};
