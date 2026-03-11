import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { traceIdMiddleware } from './middleware/traceId';
import { globalRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { eventService } from './services/eventService';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import uploadRoutes from './routes/upload';
import jobRoutes from './routes/jobs';
import logRoutes from './routes/logs';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);
      if (isLocalhost || origin === config.frontendUrl) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(traceIdMiddleware);
app.use(globalRateLimiter);

app.use((req, res, next) => {
  res.on('finish', () => {
    const durationMs = Date.now() - req.startTime;
    eventService
      .log({
        traceId: req.traceId,
        eventType: 'api',
        level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
        message: `${req.method} ${req.path} ${res.statusCode}`,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs,
        stage: 'response',
        userId: req.user?.userId,
      })
      .catch(() => {});
  });
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/upload', uploadRoutes);
app.use('/jobs', jobRoutes);
app.use('/logs', logRoutes);

app.use(errorHandler);

export default app;
