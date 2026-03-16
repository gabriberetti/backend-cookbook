'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { StatusDot } from '@/components/ui/StatusDot';
import { EventTimeline } from '@/components/timeline/EventTimeline';
import { LogEventType } from '@/types';

const EVENT_TYPES: (LogEventType | 'all')[] = ['all', 'auth', 'database', 'api', 'cloud', 'job', 'error'];

const TYPE_COLOR: Record<string, string> = {
  all:      '#3b82f6',
  auth:     '#3b82f6',
  database: '#10b981',
  api:      '#8b5cf6',
  cloud:    '#f59e0b',
  job:      '#06b6d4',
  error:    '#ef4444',
};

export default function TimelinePage() {
  const { connected, events } = useSocket();
  const [filter, setFilter] = useState<LogEventType | 'all'>('all');

  const filtered = filter === 'all' ? events : events.filter((e) => e.eventType === filter);

  return (
    <div className="max-w-4xl mx-auto px-6" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-4 mb-10"
      >
        <div>
          <p className="font-mono mb-2" style={{ fontSize: '11px', color: '#10b981', letterSpacing: '0.06em' }}>
            // MongoDB · Socket.io · event-driven
          </p>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-h1)', color: 'var(--text-primary)' }}>
            Event Timeline
          </h1>
          <p className="mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Chronological stream of all backend events in real time.
          </p>
        </div>
        <StatusDot connected={connected} label={connected ? 'Live' : 'Offline'} />
      </motion.div>

      {/* Filter chips */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex items-center gap-2 flex-wrap mb-8"
      >
        {EVENT_TYPES.map((type) => {
          const active = filter === type;
          const color  = TYPE_COLOR[type] ?? '#94a3b8';
          const count  = type === 'all' ? events.length : events.filter((e) => e.eventType === type).length;

          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono border transition-all"
              style={{
                fontSize: '12px',
                backgroundColor: active ? `${color}15` : 'transparent',
                borderColor:     active ? `${color}40` : 'rgba(255,255,255,0.08)',
                color:           active ? color          : 'var(--text-secondary)',
                boxShadow:       active ? `0 0 12px ${color}15` : 'none',
              }}
            >
              {type}
              <span
                className="px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  fontSize: '10px',
                  backgroundColor: active ? `${color}20` : 'rgba(255,255,255,0.05)',
                  color: active ? color : 'var(--text-secondary)',
                  minWidth: 20,
                  textAlign: 'center',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Timeline card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="rounded-[var(--radius-card)] border p-6 mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%), var(--bg-card)',
          borderColor: 'rgba(255,255,255,0.06)',
          boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <EventTimeline events={filtered} />
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="rounded-[var(--radius-card)] border p-6"
        style={{ borderColor: 'rgba(16,185,129,0.18)', backgroundColor: 'rgba(16,185,129,0.04)' }}
      >
        <p className="font-mono mb-2" style={{ fontSize: '11px', color: '#10b981', letterSpacing: '0.04em' }}>
          // Event-driven architecture
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          Every backend operation emits a structured event: auth actions, database writes, cloud uploads, and background jobs all appear here. Events are persisted to MongoDB and broadcast over WebSocket.
        </p>
      </motion.div>
    </div>
  );
}
