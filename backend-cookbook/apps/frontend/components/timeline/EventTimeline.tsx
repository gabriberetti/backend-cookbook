'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BackendEvent } from '@/types';
import { formatTimestamp, EVENT_TYPE_COLORS } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

// Color per event type for the timeline dot
const DOT_COLOR: Record<string, string> = {
  auth:     '#3b82f6',
  database: '#10b981',
  api:      '#8b5cf6',
  cloud:    '#f59e0b',
  job:      '#06b6d4',
  error:    '#ef4444',
};

interface EventTimelineProps {
  events: BackendEvent[];
}

export function EventTimeline({ events }: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4" style={{ color: 'var(--text-secondary)' }}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-medium mb-1" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>No events yet</p>
          <p className="font-mono" style={{ fontSize: '12px' }}>Trigger backend operations to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{ left: 11, backgroundColor: 'rgba(255,255,255,0.06)' }}
      />

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {events.slice(0, 100).map((event) => {
            const dotColor = DOT_COLOR[event.eventType] ?? '#475569';
            return (
              <motion.div
                key={event._id ?? `${event.traceId}-${event.timestamp}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 pl-1"
              >
                {/* Timeline dot */}
                <div
                  className="relative z-10 w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                  style={{
                    backgroundColor: `${dotColor}18`,
                    border: `1.5px solid ${dotColor}50`,
                  }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                </div>

                {/* Event card */}
                <div
                  className="flex-1 rounded-xl border p-3.5"
                  style={{
                    backgroundColor: `${dotColor}05`,
                    borderColor: `${dotColor}18`,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={event.eventType}>{event.eventType}</Badge>
                      {event.method && (
                        <span className="font-mono font-bold" style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {event.method}
                        </span>
                      )}
                      {event.status != null && (
                        <span
                          className="font-mono font-bold"
                          style={{ fontSize: '11px', color: event.status < 400 ? '#10b981' : '#ef4444' }}
                        >
                          {event.status}
                        </span>
                      )}
                    </div>
                    <span className="font-mono flex-shrink-0" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>

                  <p className={`font-mono text-sm ${EVENT_TYPE_COLORS[event.eventType]}`}>
                    {event.message}
                  </p>

                  {event.traceId && (
                    <p className="font-mono mt-1" style={{ fontSize: '11px', color: '#374151' }}>
                      trace: {event.traceId.slice(0, 8)}…
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
