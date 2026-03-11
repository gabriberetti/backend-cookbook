export type LogEventType = 'auth' | 'database' | 'api' | 'cloud' | 'job' | 'error' | 'system';
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface BackendEvent {
  _id?: string;
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
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  traceId?: string;
}

export type SystemNode =
  | 'frontend'
  | 'api'
  | 'mongodb'
  | 's3'
  | 'redis'
  | 'worker'
  | 'loadbalancer';
