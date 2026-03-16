'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { StatusDot } from '@/components/ui/StatusDot';
import { Badge } from '@/components/ui/Badge';
import { formatTimestamp } from '@/lib/utils';
import { apiFetch } from '@/lib/api';

const SIMULATIONS = [
  {
    id: 'db-timeout',
    label: 'DB Timeout',
    description: 'Simulates a MongoDB connection timeout with retry logic.',
    color: '#ef4444',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 5v14c0 1.66-4.03 3-9 3S3 20.66 3 19V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
  },
  {
    id: 'auth-failure',
    label: 'Auth Failure',
    description: 'Simulates an authentication failure event.',
    color: '#f59e0b',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'rate-limit',
    label: 'Rate Limit',
    description: 'Simulates the rate limiter triggering.',
    color: '#f59e0b',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    id: 's3-error',
    label: 'S3 Error',
    description: 'Simulates an S3 upload failure with fallback.',
    color: '#ef4444',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <line x1="12" y1="13" x2="12" y2="17" />
        <line x1="12" y1="11" x2="12.01" y2="11" />
      </svg>
    ),
  },
];

export default function ConsolePage() {
  const { connected, events } = useSocket();
  const { token } = useAuth();
  const [filter, setFilter] = useState('');
  const [simulating, setSimulating] = useState<string | null>(null);

  const filteredEvents = events.filter((e) => {
    if (!filter) return true;
    return (
      e.message.toLowerCase().includes(filter.toLowerCase()) ||
      e.traceId.includes(filter) ||
      e.eventType.includes(filter)
    );
  });

  async function runSimulation(type: string) {
    if (!token) {
      alert('Please login on the Dashboard first.');
      return;
    }
    setSimulating(type);
    try {
      await apiFetch('/logs/simulate', {
        method: 'POST',
        body: JSON.stringify({ type }),
      }, token);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setSimulating(null), 1500);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-4 mb-10"
      >
        <div>
          <p className="font-mono mb-2" style={{ fontSize: '11px', color: '#ef4444', letterSpacing: '0.06em' }}>
            // Structured logs · error simulation · fault tolerance
          </p>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-h1)', color: 'var(--text-primary)' }}>
            Developer Console
          </h1>
          <p className="mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Structured log viewer and error simulation controls.
          </p>
        </div>
        <StatusDot connected={connected} label={connected ? 'Live' : 'Offline'} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Log stream panel ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Filter input */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Filter by message, trace ID, or event type…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-transparent outline-none font-mono focus:ring-1"
                style={{
                  fontSize: '12px',
                  borderColor: filter ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  boxShadow: filter ? '0 0 0 1px rgba(59,130,246,0.2)' : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              />
              {filter && (
                <button
                  onClick={() => setFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
                  </svg>
                </button>
              )}
            </div>
            <span className="font-mono shrink-0" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {filteredEvents.length} entries
            </span>
          </div>

          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[var(--radius-container)] border overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'rgba(255,255,255,0.08)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* Chrome bar */}
            <div
              className="flex items-center gap-3 px-5 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'var(--bg-card)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(239,68,68,0.7)' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(245,158,11,0.7)' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(16,185,129,0.7)' }} />
              </div>
              <span className="font-mono ml-2" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                backend-cookbook ~ logs
              </span>
              <div className="ml-auto flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: connected ? '#10b981' : '#475569' }}
                />
                <span className="font-mono" style={{ fontSize: '10px', color: connected ? '#10b981' : '#475569' }}>
                  {connected ? 'connected' : 'offline'}
                </span>
              </div>
            </div>

            {/* Log entries */}
            <div className="p-5 space-y-0.5 max-h-[520px] overflow-y-auto font-mono" style={{ fontSize: '12px' }}>
              <AnimatePresence initial={false}>
                {filteredEvents.slice(0, 100).map((event) => (
                  <motion.div
                    key={`${event.traceId}-${event.timestamp}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 py-0.5 hover:bg-white/[0.02] rounded px-1 transition-colors"
                  >
                    <span style={{ color: '#374151', flexShrink: 0 }}>
                      {formatTimestamp(event.timestamp)}
                    </span>
                    <Badge variant={event.eventType}>{event.eventType}</Badge>
                    <span
                      className="flex-1"
                      style={{
                        color: event.level === 'error'
                          ? '#ef4444'
                          : event.level === 'warn'
                          ? '#f59e0b'
                          : 'var(--text-primary)',
                      }}
                    >
                      {event.message}
                    </span>
                    <span style={{ color: '#374151', flexShrink: 0 }}>
                      [{event.traceId.slice(0, 8)}]
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-3" style={{ color: '#374151' }}>
                  <span
                    className="font-mono"
                    style={{ animation: 'pulse 1.5s ease-in-out infinite', color: '#475569' }}
                  >█</span>
                  <span style={{ color: '#475569', fontSize: '12px' }}>
                    {filter ? `No matches for "${filter}"` : 'Waiting for logs…'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">

          {/* Error simulation */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[var(--radius-card)] border p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%), var(--bg-card)',
              borderColor: 'rgba(255,255,255,0.06)',
              boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <p className="font-mono mb-1" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
              // Error Simulation
            </p>
            <h2 className="font-semibold mb-1" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
              Fault Injection
            </h2>
            <p className="mb-5" style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Trigger simulated backend failures to demonstrate fault tolerance and retry logic.
            </p>

            <div className="space-y-2.5">
              {SIMULATIONS.map((sim) => {
                const isRunning = simulating === sim.id;
                return (
                  <button
                    key={sim.id}
                    onClick={() => runSimulation(sim.id)}
                    disabled={isRunning}
                    className="w-full text-left rounded-xl border p-3.5 transition-all"
                    style={{
                      borderColor: isRunning ? `${sim.color}50` : `${sim.color}25`,
                      backgroundColor: isRunning ? `${sim.color}10` : `${sim.color}06`,
                      boxShadow: isRunning ? `0 0 16px ${sim.color}15` : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2" style={{ color: sim.color }}>
                        {sim.icon}
                        <span className="font-semibold" style={{ fontSize: '13px' }}>{sim.label}</span>
                      </div>
                      {isRunning && (
                        <span className="font-mono" style={{ fontSize: '11px', color: sim.color }}>
                          triggered…
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {sim.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Resilience note */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[var(--radius-card)] border p-5"
            style={{ borderColor: 'rgba(239,68,68,0.18)', backgroundColor: 'rgba(239,68,68,0.04)' }}
          >
            <p className="font-mono mb-2" style={{ fontSize: '11px', color: '#ef4444', letterSpacing: '0.04em' }}>
              // Resilience patterns
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Production backends handle failures gracefully — retrying failed operations, activating fallbacks, and surfacing errors with context. Click a simulation to see it in the log stream.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
