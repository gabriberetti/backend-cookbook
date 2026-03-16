'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BackendEvent } from '@/types';
import { formatTimestamp, formatDuration, STATUS_COLOR } from '@/lib/utils';

interface RequestLogProps {
  events: BackendEvent[];
}

const METHOD_STYLE: Record<string, { color: string; bg: string }> = {
  GET:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  POST:   { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  PUT:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  PATCH:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  DELETE: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)'  },
};

export function RequestLog({ events }: RequestLogProps) {
  const apiEvents = events.filter((e) => e.eventType === 'api' && e.method && e.path);

  if (apiEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4" style={{ color: 'var(--text-secondary)' }}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20M12 2l8 10-8 10" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-medium mb-1" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>No requests yet</p>
          <p className="font-mono" style={{ fontSize: '12px' }}>Waiting for API requests from the backend…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-mono">
      {/* Table header */}
      <div
        className="grid items-center px-3 py-2 mb-1 rounded-lg"
        style={{
          gridTemplateColumns: '72px 68px 1fr 56px 72px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          fontSize: '10px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontWeight: 600,
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
          {apiEvents.slice(0, 50).map((event) => {
            const methodStyle = METHOD_STYLE[event.method ?? ''] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)' };
            return (
              <motion.div
                key={event._id ?? event.traceId + event.timestamp}
                initial={{ opacity: 0, x: -8, backgroundColor: 'rgba(59,130,246,0.06)' }}
                animate={{ opacity: 1, x: 0, backgroundColor: 'rgba(255,255,255,0)' }}
                transition={{ duration: 0.35 }}
                className="grid items-center px-3 py-2 rounded-lg hover:bg-white/[0.025] transition-colors"
                style={{ gridTemplateColumns: '72px 68px 1fr 56px 72px' }}
              >
                <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                  {formatTimestamp(event.timestamp)}
                </span>

                <span>
                  <span
                    className="inline-block px-1.5 py-0.5 rounded font-bold"
                    style={{ fontSize: '10px', color: methodStyle.color, backgroundColor: methodStyle.bg }}
                  >
                    {event.method}
                  </span>
                </span>

                <span className="truncate pr-2" style={{ color: 'var(--text-primary)', fontSize: '12px' }}>
                  {event.path}
                </span>

                <span
                  className="font-bold"
                  style={{
                    fontSize: '12px',
                    color: (event.status ?? 0) < 400 ? '#10b981' : '#ef4444',
                  }}
                >
                  {event.status ?? '—'}
                </span>

                <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                  {event.durationMs != null ? formatDuration(event.durationMs) : '—'}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
