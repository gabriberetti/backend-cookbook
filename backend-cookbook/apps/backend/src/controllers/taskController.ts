import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Task } from '../models/Task';
import { AppError } from '../middleware/errorHandler';
import { eventService } from '../services/eventService';

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
});

const updateTaskSchema = createTaskSchema.partial();

export const taskController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const tasks = await Task.find({ userId }).sort({ createdAt: -1 });

      await eventService.log({
        traceId: req.traceId,
        eventType: 'database',
        level: 'info',
        message: `Fetched ${tasks.length} tasks`,
        method: 'GET',
        path: '/tasks',
        stage: 'db-query',
        userId,
      });

      res.json({ success: true, data: { tasks }, traceId: req.traceId });
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await Task.findOne({ _id: req.params.id, userId: req.user!.userId });
      if (!task) throw new AppError(404, 'Task not found', 'TASK_NOT_FOUND');

      res.json({ success: true, data: { task }, traceId: req.traceId });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = createTaskSchema.parse(req.body);
      const userId = req.user!.userId;

      const task = await Task.create({ ...body, userId });

      await eventService.log({
        traceId: req.traceId,
        eventType: 'database',
        level: 'info',
        message: `Task created: "${task.title}"`,
        method: 'POST',
        path: '/tasks',
        stage: 'db-write',
        userId,
        meta: { taskId: task.id },
      });

      res.status(201).json({ success: true, data: { task }, traceId: req.traceId });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = updateTaskSchema.parse(req.body);
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.userId },
        body,
        { new: true, runValidators: true }
      );

      if (!task) throw new AppError(404, 'Task not found', 'TASK_NOT_FOUND');

      await eventService.log({
        traceId: req.traceId,
        eventType: 'database',
        level: 'info',
        message: `Task updated: "${task.title}"`,
        method: 'PUT',
        path: `/tasks/${req.params.id}`,
        stage: 'db-write',
        userId: req.user!.userId,
      });

      res.json({ success: true, data: { task }, traceId: req.traceId });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user!.userId });
      if (!task) throw new AppError(404, 'Task not found', 'TASK_NOT_FOUND');

      await eventService.log({
        traceId: req.traceId,
        eventType: 'database',
        level: 'info',
        message: `Task deleted: "${task.title}"`,
        method: 'DELETE',
        path: `/tasks/${req.params.id}`,
        stage: 'db-delete',
        userId: req.user!.userId,
      });

      res.json({ success: true, message: 'Task deleted', traceId: req.traceId });
    } catch (err) {
      next(err);
    }
  },
};
