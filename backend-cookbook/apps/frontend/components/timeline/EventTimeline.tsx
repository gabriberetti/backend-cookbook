'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BackendEvent } from '@/types';
import { formatTimestamp, EVENT_TYPE_COLORS, EVENT_TYPE_BG } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface EventTimelineProps {
  events: BackendEvent[];
}

export function EventTimeline({ events }: EventTimelineProps) {
  return (
    <div className="relative">
      <div
        className="absolute left-[11px] top-0 bottom-0 w-px"
        style={{ backgroundColor: 'var(--border)' }}
      />

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {events.slice(0, 100).map((event, i) => (
            <motion.div
              key={event._id ?? `${event.traceId}-${event.timestamp}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i === 0 ? 0 : 0 }}
              className="flex items-start gap-4 pl-1"
            >
              <div
                className={`relative z-10 w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${EVENT_TYPE_BG[event.eventType]}`}
                style={{ borderColor: 'var(--border)' }}
              />

              <div
                className={`flex-1 rounded-lg border p-3 ${EVENT_TYPE_BG[event.eventType]}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={event.eventType}>{event.eventType}</Badge>
                    {event.method && (
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {event.method}
                      </span>
                    )}
                    {event.status && (
                      <span
                        className={`text-xs font-mono font-bold`}
                        style={{
                          color: event.status < 400 ? '#10b981' : '#ef4444',
                        }}
                      >
                        {event.status}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-xs font-mono flex-shrink-0"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>

                <p
                  className={`text-sm font-mono ${EVENT_TYPE_COLORS[event.eventType]}`}
                >
                  {event.message}
                </p>

                {event.traceId && (
                  <p className="text-xs mt-1 font-mono" style={{ color: '#475569' }}>
                    trace: {event.traceId.slice(0, 8)}...
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="text-center py-16 pl-8" style={{ color: 'var(--text-secondary)' }}>
            <div className="text-3xl mb-3">⏱</div>
            <p className="text-sm">No events yet. Trigger backend operations to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
