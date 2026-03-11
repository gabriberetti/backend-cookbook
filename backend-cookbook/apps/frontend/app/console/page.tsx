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
  },
  {
    id: 'auth-failure',
    label: 'Auth Failure',
    description: 'Simulates an authentication failure event.',
    color: '#f59e0b',
  },
  {
    id: 'rate-limit',
    label: 'Rate Limit',
    description: 'Simulates the rate limiter triggering.',
    color: '#f59e0b',
  },
  {
    id: 's3-error',
    label: 'S3 Error',
    description: 'Simulates an S3 upload failure with fallback.',
    color: '#ef4444',
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
    <div className="max-w-6xl mx-auto px-6 py-10" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10" style={{ marginBottom: 'var(--space-12)' }}>
        <div>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)' }}>
            Developer Console
          </h1>
          <p className="mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Structured log viewer and error simulation controls.
          </p>
        </div>
        <StatusDot connected={connected} label={connected ? 'Live' : 'Offline'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ gap: 'var(--space-8)' }}>
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Filter by message, trace ID, or event type..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 px-4 py-3 rounded-[var(--radius-button)] border bg-transparent outline-none font-mono focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              style={{ fontSize: 'var(--text-caption)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
            <span className="font-mono shrink-0" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              {filteredEvents.length} entries
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[var(--radius-container)] border overflow-hidden shadow-lg"
            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
          >
            <div
              className="flex items-center gap-3 px-5 py-3 border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono ml-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                backend-cookbook ~ logs
              </span>
            </div>

            <div className="p-5 space-y-1 max-h-[520px] overflow-y-auto font-mono" style={{ fontSize: 'var(--text-caption)' }}>
              <AnimatePresence initial={false}>
                {filteredEvents.slice(0, 100).map((event) => (
                  <motion.div
                    key={`${event.traceId}-${event.timestamp}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 py-0.5"
                  >
                    <span style={{ color: '#475569', flexShrink: 0 }}>
                      {formatTimestamp(event.timestamp)}
                    </span>
                    <Badge variant={event.eventType}>{event.eventType}</Badge>
                    <span
                      style={{
                        color:
                          event.level === 'error'
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
                <div className="text-center py-8" style={{ color: '#374151' }}>
                  <span className="animate-pulse">█</span> Waiting for logs...
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[var(--radius-card)] border p-6"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h2 className="font-semibold mb-2" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
              Error Simulation
            </h2>
            <p className="mb-5" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Trigger simulated backend failures to demonstrate fault tolerance and retry logic.
            </p>

            <div className="space-y-3">
              {SIMULATIONS.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => runSimulation(sim.id)}
                  disabled={simulating === sim.id}
                  className="w-full text-left rounded-[var(--radius-button)] border p-4 transition-all hover:opacity-90 disabled:opacity-50"
                  style={{
                    borderColor: `${sim.color}30`,
                    backgroundColor: `${sim.color}08`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold" style={{ fontSize: 'var(--text-caption)', color: sim.color }}>
                      {sim.label}
                    </span>
                    {simulating === sim.id && (
                      <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: sim.color }}>
                        triggered...
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                    {sim.description}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-[var(--radius-card)] border p-6"
            style={{ borderColor: 'rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.04)' }}
          >
            <p className="font-mono mb-2" style={{ fontSize: 'var(--text-caption)', color: '#ef4444' }}>// Resilience patterns</p>
            <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              Production backends handle failures gracefully — retrying failed operations, activating fallbacks, and surfacing errors with context. Click a simulation to see it in the log stream.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
