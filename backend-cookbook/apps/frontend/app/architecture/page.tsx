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
    items: ['Next.js App Router', 'TypeScript + TailwindCSS', 'Framer Motion', 'Socket.io Client'],
  },
  {
    label: 'API Layer',
    color: '#8b5cf6',
    items: ['Node.js + Express', 'JWT Auth Middleware', 'Rate Limiting', 'Request Tracing'],
  },
  {
    label: 'Data Layer',
    color: '#10b981',
    items: ['MongoDB Atlas', 'Mongoose ODM', 'Indexed Collections', 'Log Persistence'],
  },
  {
    label: 'Cloud Layer',
    color: '#f59e0b',
    items: ['AWS S3 Storage', 'Pre-signed URLs', 'Multer Uploads', 'File Processing Jobs'],
  },
];

export default function ArchitecturePage() {
  const { connected, events } = useSocket();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10" style={{ marginBottom: 'var(--space-12)' }}>
        <div>
          <h1 className="font-bold" style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)' }}>
            System Architecture
          </h1>
          <p className="mt-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Interactive map of all system components. Click nodes to explore.
          </p>
        </div>
        <StatusDot connected={connected} label={connected ? 'Live' : 'Offline'} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[var(--radius-container)] border p-6 mb-8"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            Live Architecture Map
          </h2>
          <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            Nodes pulse when active
          </span>
        </div>
        <ArchitectureMap events={events} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="rounded-[var(--radius-card)] border p-6"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <h3 className="font-semibold mb-4" style={{ fontSize: 'var(--text-h3)', color: layer.color }}>
              {layer.label}
            </h3>
            <ul className="space-y-2">
              {layer.items.map((item) => (
                <li key={item} className="flex items-center gap-2" style={{ fontSize: 'var(--text-body)' }}>
                  <span style={{ color: layer.color }}>▸</span>
                  <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ marginBottom: 'var(--space-12)' }}
      >
        <DistributedSimulation />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="rounded-[var(--radius-card)] border p-6"
        style={{ borderColor: 'rgba(59,130,246,0.2)', backgroundColor: 'rgba(59,130,246,0.04)' }}
      >
        <h3 className="font-semibold mb-4" style={{ fontSize: 'var(--text-h3)', color: 'var(--accent)' }}>
          Request Flow Explained
        </h3>
        <div className="flex items-center gap-3 font-mono flex-wrap" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
          {['Browser', '→', 'Express API', '→', 'Auth Middleware', '→', 'MongoDB', '→', 'Response'].map((step, i) => (
            <span
              key={i}
              style={{ color: step === '→' ? 'var(--text-secondary)' : 'var(--text-primary)' }}
            >
              {step}
            </span>
          ))}
        </div>
        <p className="mt-4" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
          Every request gets a unique Trace ID that follows it through each layer. You can see this in the API Monitor and Timeline pages.
        </p>
      </motion.div>
    </div>
  );
}
