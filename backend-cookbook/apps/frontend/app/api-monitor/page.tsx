'use client';

import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { StatusDot } from '@/components/ui/StatusDot';
import { RequestLog } from '@/components/api-monitor/RequestLog';
import { RequestPulse } from '@/components/animations/RequestPulse';
import { StatCardSkeleton } from '@/components/ui/Skeleton';
import { useMounted } from '@/hooks/useMounted';

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  value, label, color, delay, pulse,
}: {
  value: string | number; label: string; color: string; delay: number; pulse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[var(--radius-card)] overflow-hidden flex"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%), var(--bg-card)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: `var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Left color stripe */}
      <div className="w-1 shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}40` }} />
      <div className="flex items-center justify-between flex-1 px-5 py-4">
        <div>
          <div className="font-bold" style={{ fontSize: 'var(--text-h2)', color, lineHeight: 1 }}>
            {value}
          </div>
          <div className="font-mono mt-1.5" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {label}
          </div>
        </div>
        {pulse && <RequestPulse active={pulse} color={color} />}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApiMonitorPage() {
  const { connected, events } = useSocket();
  const mounted = useMounted();

  const apiEvents   = events.filter((e) => e.eventType === 'api');
  const successRate = apiEvents.length > 0
    ? Math.round((apiEvents.filter((e) => (e.status ?? 0) < 400).length / apiEvents.length) * 100)
    : 100;
  const avgDuration = apiEvents.length > 0
    ? Math.round(apiEvents.reduce((sum, e) => sum + (e.durationMs ?? 0), 0) / apiEvents.length)
    : 0;
  const errorCount  = apiEvents.filter((e) => (e.status ?? 0) >= 400).length;

  return (
    <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-4 mb-10"
      >
        <div>
          <p className="font-mono mb-2" style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '0.06em' }}>
            // Express middleware · Socket.io stream
          </p>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-h1)', color: 'var(--text-primary)' }}>
            API Monitor
          </h1>
          <p className="mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Real-time API request stream with status, path, and response time.
          </p>
        </div>
        <StatusDot connected={connected} label={connected ? 'Streaming' : 'Offline'} />
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {!mounted || (!connected && apiEvents.length === 0)
          ? ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444'].map((c) => (
              <StatCardSkeleton key={c} accentColor={c + '60'} />
            ))
          : <>
              <StatCard
                value={apiEvents.length}
                label="Total Requests"
                color="#8b5cf6"
                delay={0}
                pulse={connected && events[0]?.eventType === 'api'}
              />
              <StatCard value={`${successRate}%`}  label="Success Rate"  color="#10b981" delay={0.06} />
              <StatCard value={`${avgDuration}ms`} label="Avg Response"  color="#f59e0b" delay={0.12} />
              <StatCard value={errorCount}          label="Errors"        color="#ef4444" delay={0.18} />
            </>
        }
      </div>

      {/* Request stream */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[var(--radius-card)] border p-6 mb-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'rgba(255,255,255,0.06)',
          boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            Live Request Stream
          </h2>
          <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {apiEvents.length} requests captured
          </span>
        </div>
        <RequestLog events={events} />
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-[var(--radius-card)] border p-6"
        style={{ borderColor: 'rgba(139,92,246,0.18)', backgroundColor: 'rgba(139,92,246,0.04)' }}
      >
        <p className="font-mono mb-2" style={{ fontSize: '11px', color: '#8b5cf6', letterSpacing: '0.04em' }}>
          // How it works
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          Every HTTP request to the Express API is intercepted by a response middleware that measures duration and emits an event to Socket.io. This page streams those events live from the backend — no polling required.
        </p>
      </motion.div>
    </div>
  );
}
