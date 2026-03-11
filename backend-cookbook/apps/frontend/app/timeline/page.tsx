'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { StatusDot } from '@/components/ui/StatusDot';
import { EventTimeline } from '@/components/timeline/EventTimeline';
import { Badge } from '@/components/ui/Badge';
import { LogEventType } from '@/types';

const EVENT_TYPES: (LogEventType | 'all')[] = ['all', 'auth', 'database', 'api', 'cloud', 'job', 'error'];

export default function TimelinePage() {
  const { connected, events } = useSocket();
  const [filter, setFilter] = useState<LogEventType | 'all'>('all');

  const filtered = filter === 'all' ? events : events.filter((e) => e.eventType === filter);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10" style={{ marginBottom: 'var(--space-12)' }}>
        <div>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)' }}>
            Event Timeline
          </h1>
          <p className="mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Chronological stream of all backend events in real time.
          </p>
        </div>
        <StatusDot connected={connected} label={connected ? 'Live' : 'Offline'} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 flex-wrap mb-8"
        style={{ marginBottom: 'var(--space-8)' }}
      >
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className="px-4 py-2 rounded-[var(--radius-badge)] font-mono border transition-all"
            style={{
              fontSize: 'var(--text-caption)',
              backgroundColor: filter === type ? 'rgba(59,130,246,0.15)' : 'transparent',
              borderColor: filter === type ? 'rgba(59,130,246,0.4)' : 'var(--border)',
              color: filter === type ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            {type}
            {type !== 'all' && (
              <span className="ml-1.5 opacity-60">
                ({events.filter((e) => e.eventType === type).length})
              </span>
            )}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="rounded-[var(--radius-card)] border p-6"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}
      >
        <EventTimeline events={filtered} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-8 rounded-[var(--radius-card)] border p-6"
        style={{ borderColor: 'rgba(16,185,129,0.2)', backgroundColor: 'rgba(16,185,129,0.04)' }}
      >
        <p className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--accent-emerald)' }}>// Event-driven architecture</p>
        <p className="mt-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
          Every backend operation emits a structured event: auth actions, database writes, cloud uploads, and background jobs all appear here. Events are persisted to MongoDB and broadcast over WebSocket.
        </p>
      </motion.div>
    </div>
  );
}
