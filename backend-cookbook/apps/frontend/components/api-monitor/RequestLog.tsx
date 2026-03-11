'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BackendEvent } from '@/types';
import { formatTimestamp, formatDuration, STATUS_COLOR } from '@/lib/utils';

interface RequestLogProps {
  events: BackendEvent[];
}

const METHOD_COLOR: Record<string, string> = {
  GET: 'text-blue-400',
  POST: 'text-emerald-400',
  PUT: 'text-amber-400',
  PATCH: 'text-amber-400',
  DELETE: 'text-red-400',
};

export function RequestLog({ events }: RequestLogProps) {
  const apiEvents = events.filter((e) => e.eventType === 'api' && e.method && e.path);

  return (
    <div className="font-mono text-sm">
      <div
        className="grid text-xs font-semibold uppercase tracking-wider mb-2 px-3 py-2 rounded"
        style={{
          gridTemplateColumns: '80px 60px 1fr 60px 70px',
          color: 'var(--text-secondary)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <span>Time</span>
        <span>Method</span>
        <span>Path</span>
        <span>Status</span>
        <span>Duration</span>
      </div>

      <div className="space-y-0.5">
        <AnimatePresence initial={false}>
          {apiEvents.slice(0, 50).map((event) => (
            <motion.div
              key={event._id ?? event.traceId + event.timestamp}
              initial={{ opacity: 0, x: -8, backgroundColor: 'rgba(59,130,246,0.08)' }}
              animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(255,255,255,0)' }}
              transition={{ duration: 0.4 }}
              className="grid items-center px-3 py-1.5 rounded hover:bg-white/[0.02] transition-colors"
              style={{ gridTemplateColumns: '80px 60px 1fr 60px 70px' }}
            >
              <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                {formatTimestamp(event.timestamp)}
              </span>
              <span className={`font-bold text-xs ${METHOD_COLOR[event.method ?? ''] ?? 'text-slate-400'}`}>
                {event.method}
              </span>
              <span className="truncate" style={{ color: 'var(--text-primary)', fontSize: '12px' }}>
                {event.path}
              </span>
              <span className={`font-bold text-xs ${STATUS_COLOR(event.status ?? 0)}`}>
                {event.status ?? '—'}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                {event.durationMs != null ? formatDuration(event.durationMs) : '—'}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {apiEvents.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
            <div className="text-2xl mb-2">⟳</div>
            <p className="text-sm">Waiting for API requests...</p>
          </div>
        )}
      </div>
    </div>
  );
}
