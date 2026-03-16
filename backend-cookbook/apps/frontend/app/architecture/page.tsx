'use client';

import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { StatusDot } from '@/components/ui/StatusDot';
import { ArchitectureMap } from '@/components/architecture-visualizer/ArchitectureMap';
import { DistributedSimulation } from '@/components/architecture-visualizer/DistributedSimulation';

const layers = [
  {
    label: 'Client Layer',
    color: '#3b82f6',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    items: ['Next.js App Router', 'TypeScript + Tailwind CSS', 'Framer Motion', 'Socket.io Client'],
  },
  {
    label: 'API Layer',
    color: '#8b5cf6',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
        <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
      </svg>
    ),
    items: ['Node.js + Express', 'JWT Auth middleware', 'Rate limiting', 'Trace ID injection'],
  },
  {
    label: 'Data Layer',
    color: '#10b981',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    items: ['MongoDB Atlas', 'Mongoose ODM', 'Indexed collections', 'Log persistence'],
  },
  {
    label: 'Cloud & Jobs Layer',
    color: '#f59e0b',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
      </svg>
    ),
    items: ['AWS S3 Storage', 'Pre-signed URLs', 'Redis + BullMQ', 'Worker processes'],
  },
];

const flowSteps = [
  { label: 'Browser',         color: '#3b82f6' },
  { label: 'Express API',     color: '#8b5cf6' },
  { label: 'Auth Middleware', color: '#8b5cf6' },
  { label: 'MongoDB',         color: '#10b981' },
  { label: 'Socket.io Event', color: '#06b6d4' },
  { label: 'Response',        color: '#3b82f6' },
];

export default function ArchitecturePage() {
  const { connected, events } = useSocket();

  return (
    <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-start justify-between gap-4 mb-10"
      >
        <div>
          <p className="font-mono mb-2" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.06em' }}>
            // Socket.io · live event-driven · click nodes to explore
          </p>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-h1)', color: 'var(--text-primary)' }}>
            System Architecture
          </h1>
          <p className="mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Interactive map of all system components — packets fly in real time with backend events.
          </p>
        </div>
        <StatusDot connected={connected} label={connected ? 'Live' : 'Offline'} />
      </motion.div>

      {/* Architecture map */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="card-elevated rounded-[var(--radius-container)] p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: connected ? 'var(--accent-emerald)' : '#475569',
                boxShadow: connected ? '0 0 8px var(--accent-emerald)' : 'none',
                animation: connected ? 'glow-pulse 2s ease-in-out infinite' : 'none',
              }}
            />
            <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
              Live Architecture Map
            </h2>
          </div>
          <span className="font-mono hidden sm:block" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Nodes pulse · packets fly with events
          </span>
        </div>
        <ArchitectureMap events={events} />
      </motion.div>

      {/* Layer cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="card-elevated rounded-[var(--radius-card)] p-5"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${layer.color}12`, border: `1px solid ${layer.color}25` }}
              >
                {layer.icon}
              </div>
              <h3 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: layer.color }}>
                {layer.label}
              </h3>
            </div>
            <ul className="space-y-2">
              {layer.items.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                  <span style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Distributed simulation */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <DistributedSimulation />
      </motion.div>

      {/* Request flow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[var(--radius-card)] p-6"
        style={{
          border: '1px solid rgba(59,130,246,0.18)',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 100%)',
          boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(59,130,246,0.1)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h20M12 2l8 10-8 10" />
            </svg>
          </div>
          <h3 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--accent)' }}>
            Request Flow
          </h3>
        </div>

        <div className="flex items-center flex-wrap gap-0 mb-5 overflow-x-auto">
          {flowSteps.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex items-center gap-0"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div
                className="font-mono text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap"
                style={{
                  backgroundColor: `${step.color}12`,
                  border: `1px solid ${step.color}25`,
                  color: step.color,
                }}
              >
                {step.label}
              </div>
              {i < flowSteps.length - 1 && (
                <motion.span
                  className="mx-1 font-mono text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                >
                  →
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          Every request receives a unique{' '}
          <code
            className="font-mono px-1.5 py-0.5 rounded"
            style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--accent)', fontSize: '11px' }}
          >
            traceId
          </code>{' '}
          that follows it through each layer. Track it live in the{' '}
          <span style={{ color: '#8b5cf6' }}>API Monitor</span> and{' '}
          <span style={{ color: '#10b981' }}>Timeline</span> pages.
        </p>
      </motion.div>
    </div>
  );
}
