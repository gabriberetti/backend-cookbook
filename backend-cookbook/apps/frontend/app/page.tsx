'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { BioluminescentGrid, BioluminescentGridItem } from '@/components/ui/bioluminescent-grid';

const modules = [
  {
    icon: '🔐',
    title: 'Authentication',
    description: 'JWT token generation, bcrypt password hashing, and protected routes.',
    color: '#3b82f6',
    href: '/modules/authentication',
  },
  {
    icon: '🗄️',
    title: 'Database Systems',
    description: 'MongoDB CRUD operations, data modeling, and indexed queries.',
    color: '#10b981',
    href: '/modules/database',
  },
  {
    icon: '🌐',
    title: 'REST API',
    description: 'Structured endpoints with validation, error handling, and tracing.',
    color: '#8b5cf6',
    href: '/modules/rest-api',
  },
  {
    icon: '☁️',
    title: 'Cloud Storage',
    description: 'File uploads to AWS S3 with pre-signed URL access control.',
    color: '#f59e0b',
    href: '/modules/cloud-storage',
  },
  {
    icon: '⚡',
    title: 'Background Jobs',
    description: 'Async job queues with BullMQ workers and Redis.',
    color: '#ef4444',
    href: '/modules/background-jobs',
  },
  {
    icon: '🛡️',
    title: 'Security',
    description: 'Rate limiting, Helmet.js headers, and input sanitization.',
    color: '#06b6d4',
    href: '/modules/security',
  },
];

const stats = [
  { label: 'Backend Modules', value: '6' },
  { label: 'API Endpoints', value: '15+' },
  { label: 'Real-time Events', value: 'Live' },
  { label: 'Tech Stack', value: 'Full' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <BackgroundPaths
        title="Backend Cookbook"
        subtitle="A live, interactive platform that visually demonstrates how backend systems work — from authentication to cloud storage, background jobs to real-time event streams."
        ctaLabel="Explore Dashboard"
        ctaHref="/dashboard"
      />

      <section className="relative max-w-6xl mx-auto px-6 pb-24" style={{ paddingTop: 'var(--space-16)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-[var(--radius-container)] overflow-hidden border mb-20"
          style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="py-8 text-center"
              style={{ backgroundColor: 'var(--bg-card)', paddingLeft: 'var(--space-6)', paddingRight: 'var(--space-6)' }}
            >
              <div className="font-bold mb-2" style={{ fontSize: 'var(--text-h2)', color: 'var(--accent)' }}>
                {stat.value}
              </div>
              <div className="font-mono text-[var(--text-caption)]" style={{ color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ marginBottom: 'var(--space-16)' }}>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-bold mb-2"
            style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)' }}
          >
            Core Modules
          </motion.h2>
          <p className="mb-8" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            Each module demonstrates a real backend skill with live functionality.
          </p>

          <BioluminescentGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
              >
                <BioluminescentGridItem className="h-full">
                  <Link href={mod.href} className="block p-6 h-full">
                    <div className="text-3xl mb-4">{mod.icon}</div>
                    <h3 className="font-semibold mb-2" style={{ fontSize: 'var(--text-h3)', color: mod.color }}>
                      {mod.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {mod.description}
                    </p>
                  </Link>
                </BioluminescentGridItem>
              </motion.div>
            ))}
          </BioluminescentGrid>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="rounded-[var(--radius-container)] border p-8 text-center"
          style={{
            borderColor: 'rgba(59,130,246,0.2)',
            backgroundColor: 'rgba(59,130,246,0.04)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <p className="font-mono mb-4" style={{ fontSize: 'var(--text-caption)', color: 'var(--accent)' }}>
            // Three principles behind every feature
          </p>
          <div
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
            style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>1.</span> Real backend capability
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>2.</span> Visual representation
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>3.</span> Simple explanation
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
