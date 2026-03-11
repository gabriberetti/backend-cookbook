'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { AnimatedCard } from '@/components/ui/Card';
import { StatusDot } from '@/components/ui/StatusDot';
import { GlowEffect } from '@/components/ui/glow-effect';
import { RequestPulse } from '@/components/animations/RequestPulse';
import { DatabaseWritePulse } from '@/components/animations/DatabaseWritePulse';
import { CloudUploadFlow } from '@/components/animations/CloudUploadFlow';
import { Badge } from '@/components/ui/Badge';
import { formatTimestamp } from '@/lib/utils';
import { apiFetch } from '@/lib/api';

const modules = [
  { slug: 'authentication', label: 'Authentication', icon: '🔐', color: '#3b82f6' },
  { slug: 'database', label: 'Database', icon: '🗄️', color: '#10b981' },
  { slug: 'rest-api', label: 'REST API', icon: '🌐', color: '#8b5cf6' },
  { slug: 'cloud-storage', label: 'Cloud Storage', icon: '☁️', color: '#f59e0b' },
  { slug: 'background-jobs', label: 'Background Jobs', icon: '⚡', color: '#ef4444' },
  { slug: 'security', label: 'Security', icon: '🛡️', color: '#06b6d4' },
];

export default function DashboardPage() {
  const { connected, events } = useSocket();
  const { token, user, login, register, logout } = useAuth();
  const { getModuleScore, getTotalScore } = useChallengeProgress();
  const { earned } = getTotalScore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  const recentEvents = events.slice(0, 5);
  const apiEvents = events.filter((e) => e.eventType === 'api').length;
  const dbEvents = events.filter((e) => e.eventType === 'database').length;
  const authEvents = events.filter((e) => e.eventType === 'auth').length;

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      if (authMode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
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
      await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: taskTitle }),
      }, token);
      setTaskTitle('');
    } catch (err) {
      console.error(err);
    }
  }

  const stats = [
    { label: 'API Calls', value: apiEvents, color: '#8b5cf6', glow: false },
    { label: 'DB Operations', value: dbEvents, color: '#10b981', glow: false },
    { label: 'Auth Events', value: authEvents, color: '#3b82f6', glow: false },
    { label: 'Total Events', value: events.length, color: '#f59e0b', glow: connected },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10" style={{ marginBottom: 'var(--space-12)' }}>
        <div>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)' }}>
            Developer Dashboard
          </h1>
          <p className="mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Central overview of backend activity and modules
          </p>
        </div>
        <StatusDot connected={connected} label={connected ? 'Live' : 'Disconnected'} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10" style={{ marginBottom: 'var(--space-12)' }}>
        {stats.map((stat, i) => (
          <AnimatedCard key={stat.label} delay={i * 0.06} className="relative overflow-hidden">
            {stat.glow && (
              <GlowEffect
                mode="rotate"
                colors={['#3b82f6', '#06b6d4', '#8b5cf6']}
                blur="medium"
                duration={6}
                className="w-32 h-32 -top-8 -right-8"
              />
            )}
            <div className="relative z-10 p-6" style={{ padding: 'var(--space-6)' }}>
              <div className="font-bold mb-2" style={{ fontSize: 'var(--text-h2)', color: stat.color }}>
                {stat.value}
              </div>
              <div className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
        <AnimatedCard delay={0.2} className="col-span-1">
          <div style={{ padding: 'var(--space-6)' }}>
          <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            System Activity
          </h2>
          <div className="flex items-center justify-around py-2">
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
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.25} className="md:col-span-2">
          <div style={{ padding: 'var(--space-6)' }}>
          <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            Recent Events
          </h2>
          <div className="space-y-2">
            {recentEvents.length === 0 && (
              <p className="text-xs py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                No events yet — trigger an action below
              </p>
            )}
            {recentEvents.map((event) => (
              <div key={event.traceId + event.timestamp} className="flex items-center gap-3" style={{ fontSize: 'var(--text-caption)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{formatTimestamp(event.timestamp)}</span>
                <Badge variant={event.eventType}>{event.eventType}</Badge>
                <span className="truncate" style={{ color: 'var(--text-primary)' }}>{event.message}</span>
              </div>
            ))}
          </div>
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
        <AnimatedCard delay={0.3}>
          <div style={{ padding: 'var(--space-6)' }}>
          <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            {user ? `Logged in as ${user.name}` : 'Authentication Module'}
          </h2>

          {user ? (
            <div className="space-y-3">
              <div
                className="rounded-lg p-3 border"
                style={{ borderColor: 'rgba(59,130,246,0.2)', backgroundColor: 'rgba(59,130,246,0.05)' }}
              >
                <p className="text-xs font-mono" style={{ color: '#3b82f6' }}>JWT token issued ✓</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {user.email}
                </p>
              </div>
              <form onSubmit={handleCreateTask} className="flex gap-2">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Create a task (triggers DB write)"
                  className="flex-1 text-xs px-3 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg text-xs font-semibold"
                  style={{ backgroundColor: '#10b981', color: '#fff' }}
                >
                  Add
                </button>
              </form>
              <button
                onClick={logout}
                className="text-xs py-1.5 px-3 rounded border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuth} className="space-y-3">
              <div className="flex gap-2 mb-3">
                {(['login', 'register'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAuthMode(mode)}
                    className="px-3 py-1 rounded text-xs font-mono capitalize"
                    style={{
                      backgroundColor: authMode === mode ? 'rgba(59,130,246,0.15)' : 'transparent',
                      color: authMode === mode ? '#3b82f6' : 'var(--text-secondary)',
                      border: `1px solid ${authMode === mode ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {authMode === 'register' && (
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full text-xs px-3 py-2 rounded-lg border bg-transparent outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full text-xs px-3 py-2 rounded-lg border bg-transparent outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full text-xs px-3 py-2 rounded-lg border bg-transparent outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />

              {authError && (
                <p className="text-xs" style={{ color: '#ef4444' }}>{authError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-lg text-xs font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#3b82f6', color: '#fff' }}
              >
                {loading ? 'Loading...' : authMode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>
          )}
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.35}>
          <div style={{ padding: 'var(--space-6)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
              Module Progress
            </h2>
            <Link href="/modules" className="text-xs font-mono hover:underline" style={{ color: '#3b82f6' }}>
              View all →
            </Link>
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>Overall</span>
              <span className="text-xs font-mono font-bold" style={{ color: '#3b82f6' }}>
                {earned} / {modules.length * 2} pts
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
              <motion.div
                className="h-full rounded-full bg-blue-500"
                animate={{ width: `${(earned / (modules.length * 2)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {modules.map((mod) => {
              const score = getModuleScore(mod.slug);
              return (
                <Link key={mod.slug} href={`/modules/${mod.slug}`}>
                  <div
                    className="flex items-center gap-2 rounded-lg p-2.5 border transition-all hover:opacity-80"
                    style={{
                      borderColor: score > 0 ? `${mod.color}40` : 'var(--border)',
                      backgroundColor: score > 0 ? `${mod.color}06` : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <span>{mod.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: mod.color }}>
                        {mod.label}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        {score}/2 pts
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: score >= 1 ? mod.color : 'var(--border)' }} />
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: score >= 2 ? mod.color : 'var(--border)' }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
