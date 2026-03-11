import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LogEventType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export const EVENT_TYPE_COLORS: Record<LogEventType, string> = {
  auth: 'text-blue-400',
  database: 'text-emerald-400',
  api: 'text-violet-400',
  cloud: 'text-amber-400',
  job: 'text-cyan-400',
  error: 'text-red-400',
  system: 'text-slate-400',
};

export const EVENT_TYPE_BG: Record<LogEventType, string> = {
  auth: 'bg-blue-500/10 border-blue-500/20',
  database: 'bg-emerald-500/10 border-emerald-500/20',
  api: 'bg-violet-500/10 border-violet-500/20',
  cloud: 'bg-amber-500/10 border-amber-500/20',
  job: 'bg-cyan-500/10 border-cyan-500/20',
  error: 'bg-red-500/10 border-red-500/20',
  system: 'bg-slate-500/10 border-slate-500/20',
};

export const STATUS_COLOR = (status: number): string => {
  if (status < 300) return 'text-emerald-400';
  if (status < 400) return 'text-amber-400';
  return 'text-red-400';
};
