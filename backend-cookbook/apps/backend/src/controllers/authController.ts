import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { eventService } from '../services/eventService';

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as Parameters<typeof jwt.sign>[2]
  );
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = registerSchema.parse(req.body);

      const existing = await User.findOne({ email: body.email });
      if (existing) throw new AppError(409, 'Email already registered', 'EMAIL_IN_USE');

      const hashedPassword = await bcrypt.hash(body.password, 12);
      const user = await User.create({
        name: body.name,
        email: body.email,
        password: hashedPassword,
      });

      const token = signToken(user.id, user.email);

      await eventService.log({
        traceId: req.traceId,
        eventType: 'auth',
        level: 'info',
        message: `User registered: ${user.email}`,
        stage: 'register',
        userId: user.id,
        meta: { name: user.name },
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: { token, user: { id: user.id, name: user.name, email: user.email } },
        traceId: req.traceId,
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = loginSchema.parse(req.body);

      const user = await User.findOne({ email: body.email }).select('+password');
      if (!user) throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');

      const isValid = await bcrypt.compare(body.password, user.password);
      if (!isValid) throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');

      const token = signToken(user.id, user.email);

      await eventService.log({
        traceId: req.traceId,
        eventType: 'auth',
        level: 'info',
        message: `User logged in: ${user.email}`,
        stage: 'login',
        userId: user.id,
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: { token, user: { id: user.id, name: user.name, email: user.email } },
        traceId: req.traceId,
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.user?.userId);
      if (!user) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');

      res.json({
        success: true,
        data: { user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt } },
        traceId: req.traceId,
      });
    } catch (err) {
      next(err);
    }
  },
};
