'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { AnimatedCard } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';
import { GlowEffect } from '@/components/ui/glow-effect';
import { StatCardSkeleton, EventRowSkeleton } from '@/components/ui/Skeleton';
import { useMounted } from '@/hooks/useMounted';
import { RequestPulse } from '@/components/animations/RequestPulse';
import { DatabaseWritePulse } from '@/components/animations/DatabaseWritePulse';
import { CloudUploadFlow } from '@/components/animations/CloudUploadFlow';
import { Badge } from '@/components/ui/Badge';
import { formatTimestamp } from '@/lib/utils';
import { apiFetch } from '@/lib/api';

const modules = [
  { slug: 'authentication',  label: 'Auth',        color: '#3b82f6' },
  { slug: 'database',        label: 'Database',     color: '#10b981' },
  { slug: 'rest-api',        label: 'REST API',     color: '#8b5cf6' },
  { slug: 'cloud-storage',   label: 'Cloud',        color: '#f59e0b' },
  { slug: 'background-jobs', label: 'Jobs',         color: '#ef4444' },
  { slug: 'security',        label: 'Security',     color: '#06b6d4' },
];

// ─── Service status strip ─────────────────────────────────────────────────────

function ServiceStatusStrip({ connected, dbActive, jobActive, cloudActive }: {
  connected: boolean;
  dbActive: boolean;
  jobActive: boolean;
  cloudActive: boolean;
}) {
  const services = [
    { label: 'Express API',  active: connected,   color: '#8b5cf6' },
    { label: 'MongoDB',      active: dbActive,    color: '#10b981' },
    { label: 'Redis',        active: jobActive,   color: '#ef4444' },
    { label: 'AWS S3',       active: cloudActive, color: '#f59e0b' },
    { label: 'Socket.io',    active: connected,   color: '#06b6d4' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl mb-8"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span className="font-mono text-xs tracking-widest shrink-0" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
        SERVICES
      </span>
      <div className="h-3 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
      {services.map((svc) => (
        <div key={svc.label} className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              backgroundColor: svc.active ? svc.color : '#334155',
              boxShadow: svc.active ? `0 0 6px ${svc.color}` : 'none',
              animation: svc.active ? 'glow-pulse 2s ease-in-out infinite' : 'none',
            }}
          />
          <span className="font-mono text-xs" style={{ color: svc.active ? svc.color : '#475569' }}>
            {svc.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-mono text-xs font-medium tracking-widest" style={{ color: 'var(--accent)' }}>
        // {children}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { connected, events }                     = useSocket();
  const { token, user, login, register, logout }  = useAuth();
  const { getModuleScore, getTotalScore }          = useChallengeProgress();
  const { earned }                                = getTotalScore();

  const mounted = useMounted();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSuccess, setTaskSuccess] = useState(false);

  const recentEvents = events.slice(0, 6);
  const apiEvents    = events.filter(e => e.eventType === 'api').length;
  const dbEvents     = events.filter(e => e.eventType === 'database').length;
  const authEvents   = events.filter(e => e.eventType === 'auth').length;
  const cloudActive  = events.some(e => e.eventType === 'cloud');
  const jobActive    = events.some(e => e.eventType === 'job');

  const stats = [
    { label: 'API Calls',     value: apiEvents,    color: '#8b5cf6', glow: false },
    { label: 'DB Operations', value: dbEvents,     color: '#10b981', glow: false },
    { label: 'Auth Events',   value: authEvents,   color: '#3b82f6', glow: false },
    { label: 'Total Events',  value: events.length, color: '#f59e0b', glow: connected },
  ];

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      if (authMode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !taskTitle.trim()) return;
    try {
      await apiFetch('/tasks', { method: 'POST', body: JSON.stringify({ title: taskTitle }) }, token);
      setTaskTitle('');
      setTaskSuccess(true);
      setTimeout(() => setTaskSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs font-medium tracking-widest" style={{ color: 'var(--accent)' }}>
              // DASHBOARD
            </span>
          </div>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)' }}>
            Developer Dashboard
          </h1>
          <p className="mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Central overview of backend activity and module progress
          </p>
        </div>
        <StatusDot connected={connected} label={connected ? 'Live' : 'Disconnected'} />
      </motion.div>

      {/* Service status strip */}
      <ServiceStatusStrip
        connected={connected}
        dbActive={dbEvents > 0}
        jobActive={jobActive}
        cloudActive={cloudActive}
      />

      {/* ── Stats ─────────────────────────────────────── */}
      <SectionLabel>METRICS</SectionLabel>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {!mounted || (!connected && events.length === 0)
          ? stats.map((stat) => <StatCardSkeleton key={stat.label} accentColor={stat.color + '60'} />)
          : stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="card-elevated rounded-[var(--radius-card)] relative overflow-hidden"
              style={{ padding: 'var(--space-5)' }}
            >
              {stat.glow && (
                <GlowEffect
                  mode="rotate"
                  colors={['#3b82f6', '#06b6d4', '#8b5cf6']}
                  blur="medium"
                  duration={6}
                  className="w-28 h-28 -top-6 -right-6"
                />
              )}
              <div
                className="absolute left-0 top-4 bottom-4 w-0.5 rounded-r"
                style={{ backgroundColor: stat.color, boxShadow: `0 0 8px ${stat.color}` }}
              />
              <div className="relative z-10 pl-3">
                <div
                  className="font-bold mb-1 font-mono tabular-nums"
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))
        }
      </div>

      {/* ── Activity + Events ─────────────────────────── */}
      <SectionLabel>LIVE ACTIVITY</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

        {/* System animations */}
        <AnimatedCard delay={0.2}>
          <h2 className="font-semibold mb-5" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            System Activity
          </h2>
          <div className="flex items-center justify-around py-3">
            <div className="flex flex-col items-center gap-2">
              <RequestPulse active={events[0]?.eventType === 'api'} color="#8b5cf6" />
              <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>API</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DatabaseWritePulse events={events} />
              <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>DB</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CloudUploadFlow events={events} />
            </div>
          </div>
        </AnimatedCard>

        {/* Event feed */}
        <AnimatedCard delay={0.25} className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
              Recent Events
            </h2>
            <Link
              href="/timeline"
              className="font-mono text-xs hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              View all →
            </Link>
          </div>

          <div className="space-y-2">
            {recentEvents.length === 0 && !connected && mounted && (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => <EventRowSkeleton key={i} />)}
              </div>
            )}
            {recentEvents.length === 0 && connected && (
              <div className="py-8 text-center">
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  No events yet
                </p>
                <p className="text-xs font-mono" style={{ color: 'var(--accent)', opacity: 0.6 }}>
                  Trigger an action below to see live events
                </p>
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {recentEvents.map((event) => (
                <motion.div
                  key={event.traceId + event.timestamp}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    fontSize: 'var(--text-caption)',
                  }}
                >
                  <span className="shrink-0 font-mono" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
                    {formatTimestamp(event.timestamp)}
                  </span>
                  <Badge variant={event.eventType}>{event.eventType}</Badge>
                  <span className="truncate" style={{ color: 'var(--text-primary)' }}>
                    {event.message}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </AnimatedCard>
      </div>

      {/* ── Auth + Progress ───────────────────────────── */}
      <SectionLabel>INTERACT</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Auth card */}
        <AnimatedCard delay={0.3}>
          <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            {user ? `Logged in as ${user.name}` : 'Authentication Module'}
          </h2>

          {user ? (
            <div className="space-y-3">
              <div
                className="rounded-lg p-3"
                style={{
                  backgroundColor: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.18)',
                }}
              >
                <p className="text-xs font-mono mb-0.5" style={{ color: '#3b82f6' }}>
                  ✓ JWT token issued
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
              </div>

              <form onSubmit={handleCreateTask} className="flex gap-2">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="New task title (triggers DB write)"
                  style={inputStyle}
                />
                <button
                  type="submit"
                  className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: '#10b981',
                    color: '#fff',
                    boxShadow: taskSuccess ? '0 0 16px rgba(16,185,129,0.4)' : 'none',
                  }}
                >
                  {taskSuccess ? '✓' : 'Add'}
                </button>
              </form>

              <button
                onClick={logout}
                className="text-xs py-1.5 px-3 rounded-lg transition-colors"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'transparent',
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-3">
              {/* Mode toggle */}
              <div className="flex gap-1.5 p-1 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                {(['login', 'register'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => { setAuthMode(mode); setAuthError(''); }}
                    className="flex-1 py-1.5 rounded-md text-xs font-mono capitalize transition-all"
                    style={{
                      backgroundColor: authMode === mode ? 'rgba(59,130,246,0.2)' : 'transparent',
                      color: authMode === mode ? '#3b82f6' : 'var(--text-secondary)',
                      border: authMode === mode ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {authMode === 'register' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={inputStyle}
                  />
                </motion.div>
              )}
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={inputStyle}
              />

              {authError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  {authError}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(59,130,246,0.2)',
                  border: '1px solid rgba(59,130,246,0.3)',
                }}
              >
                {loading ? 'Loading…' : authMode === 'login' ? 'Login →' : 'Register →'}
              </button>
            </form>
          )}
        </AnimatedCard>

        {/* Module progress */}
        <AnimatedCard delay={0.35}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
              Module Progress
            </h2>
            <Link href="/modules" className="text-xs font-mono hover:underline" style={{ color: 'var(--accent)' }}>
              View all →
            </Link>
          </div>

          {/* Overall bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>Overall progress</span>
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>
                {earned} / {modules.length * 2} pts
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}
                animate={{ width: `${(earned / (modules.length * 2)) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* Module grid */}
          <div className="grid grid-cols-2 gap-2">
            {modules.map(mod => {
              const score = getModuleScore(mod.slug);
              return (
                <Link key={mod.slug} href={`/modules/${mod.slug}`}>
                  <div
                    className="flex items-center gap-2.5 rounded-lg p-2.5 transition-all cursor-pointer"
                    style={{
                      border: `1px solid ${score > 0 ? `${mod.color}30` : 'rgba(255,255,255,0.06)'}`,
                      backgroundColor: score > 0 ? `${mod.color}08` : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    {/* Color dot instead of emoji */}
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: mod.color,
                        boxShadow: score > 0 ? `0 0 6px ${mod.color}` : 'none',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: score > 0 ? mod.color : 'var(--text-secondary)' }}>
                        {mod.label}
                      </p>
                      <p className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                        {score}/2 pts
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: score >= 1 ? mod.color : 'rgba(255,255,255,0.1)' }} />
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: score >= 2 ? mod.color : 'rgba(255,255,255,0.1)' }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
