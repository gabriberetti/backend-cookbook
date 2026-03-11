import Redis from 'ioredis';
import { config } from './index';

export const redis = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

redis.on('connect', () => console.log('[Redis] Connected'));
redis.on('error', (err) => console.error('[Redis] Error:', err));

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
    console.log('[Redis] Connected successfully');
  } catch {
    console.warn('[Redis] Could not connect — background jobs will be disabled');
  }
}
