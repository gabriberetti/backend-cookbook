import { EventEmitter } from 'events';
import { Log, LogEventType, LogLevel } from '../models/Log';

export interface BackendEvent {
  traceId: string;
  eventType: LogEventType;
  level: LogLevel;
  message: string;
  method?: string;
  path?: string;
  status?: number;
  durationMs?: number;
  stage?: string;
  userId?: string;
  meta?: Record<string, unknown>;
  timestamp: Date;
}

class EventService extends EventEmitter {
  async log(data: Omit<BackendEvent, 'timestamp'>): Promise<void> {
    const event: BackendEvent = { ...data, timestamp: new Date() };

    this.emit('backend-event', event);

    try {
      await Log.create(event);
    } catch (err) {
      console.error('[EventService] Failed to persist log:', err);
    }
  }
}

export const eventService = new EventService();
eventService.setMaxListeners(50);
