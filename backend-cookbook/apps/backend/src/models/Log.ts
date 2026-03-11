import mongoose, { Document, Schema } from 'mongoose';

export type LogEventType = 'auth' | 'database' | 'api' | 'cloud' | 'job' | 'error' | 'system';
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface ILog extends Document {
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

const logSchema = new Schema<ILog>(
  {
    traceId: { type: String, required: true, index: true },
    eventType: {
      type: String,
      enum: ['auth', 'database', 'api', 'cloud', 'job', 'error', 'system'],
      required: true,
    },
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'debug'],
      default: 'info',
    },
    message: { type: String, required: true },
    method: String,
    path: String,
    status: Number,
    durationMs: Number,
    stage: String,
    userId: String,
    meta: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

logSchema.index({ timestamp: -1 });
logSchema.index({ eventType: 1, timestamp: -1 });

export const Log = mongoose.model<ILog>('Log', logSchema);
