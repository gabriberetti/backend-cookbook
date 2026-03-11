'use client';

import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { AnimatedCard } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';
import { RequestLog } from '@/components/api-monitor/RequestLog';
import { RequestPulse } from '@/components/animations/RequestPulse';

export default function ApiMonitorPage() {
  const { connected, events } = useSocket();

  const apiEvents = events.filter((e) => e.eventType === 'api');
  const successRate =
    apiEvents.length > 0
      ? Math.round((apiEvents.filter((e) => (e.status ?? 0) < 400).length / apiEvents.length) * 100)
      : 100;
  const avgDuration =
    apiEvents.length > 0
      ? Math.round(apiEvents.reduce((sum, e) => sum + (e.durationMs ?? 0), 0) / apiEvents.length)
      : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10" style={{ marginBottom: 'var(--space-12)' }}>
        <div>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)' }}>
            API Monitor
          </h1>
          <p className="mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Real-time API request stream with status, path, and response time.
          </p>
        </div>
        <StatusDot connected={connected} label={connected ? 'Streaming' : 'Offline'} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
        <AnimatedCard delay={0}>
          <div className="flex items-center justify-between p-6">
            <div>
              <div className="font-bold text-violet-400" style={{ fontSize: 'var(--text-h2)' }}>{apiEvents.length}</div>
              <div className="font-mono mt-1" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>Total Requests</div>
            </div>
            <RequestPulse active={connected && events[0]?.eventType === 'api'} color="#8b5cf6" />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.06}>
          <div className="p-6">
            <div className="font-bold text-emerald-400" style={{ fontSize: 'var(--text-h2)' }}>{successRate}%</div>
            <div className="font-mono mt-1" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>Success Rate</div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.12}>
          <div className="p-6">
            <div className="font-bold text-amber-400" style={{ fontSize: 'var(--text-h2)' }}>{avgDuration}ms</div>
            <div className="font-mono mt-1" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>Avg Response</div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.18}>
          <div className="p-6">
            <div className="font-bold text-red-400" style={{ fontSize: 'var(--text-h2)' }}>
              {apiEvents.filter((e) => (e.status ?? 0) >= 400).length}
            </div>
            <div className="font-mono mt-1" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>Errors</div>
          </div>
        </AnimatedCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-[var(--radius-card)] border p-6"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            Live Request Stream
          </h2>
          <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            {apiEvents.length} requests captured
          </span>
        </div>
        <RequestLog events={events} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 rounded-[var(--radius-card)] border p-6"
        style={{ borderColor: 'rgba(139,92,246,0.2)', backgroundColor: 'rgba(139,92,246,0.04)' }}
      >
        <p className="font-mono" style={{ fontSize: 'var(--text-caption)', color: '#8b5cf6' }}>// How it works</p>
        <p className="mt-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
          Every HTTP request to the Express API is intercepted by a response middleware that measures duration and emits an event to Socket.io. This page streams those events live from the backend — no polling required.
        </p>
      </motion.div>
    </div>
  );
}
