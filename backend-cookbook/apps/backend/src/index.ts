import http from 'http';
import app from './app';
import { config } from './config';
import { connectDatabase } from './config/db';
import { connectRedis } from './config/redis';
import { initSocketServer } from './services/socketService';
import { startWorkers } from './services/queueService';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await connectRedis();

  const httpServer = http.createServer(app);
  initSocketServer(httpServer);

  if (config.nodeEnv !== 'test') {
    try {
      startWorkers();
    } catch {
      console.warn('[Workers] Could not start — Redis may be unavailable');
    }
  }

  httpServer.listen(config.port, () => {
    console.log(`[Server] Running on http://localhost:${config.port}`);
    console.log(`[Server] Environment: ${config.nodeEnv}`);
  });
}

bootstrap().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
