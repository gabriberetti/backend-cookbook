'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { BioluminescentGrid, BioluminescentGridItem } from '@/components/ui/bioluminescent-grid';

function CountUp({ target, duration = 1400, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const steps = 60;
    const stepMs = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (step >= steps) clearInterval(timer);
    }, stepMs);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{value.toLocaleString()}{suffix}</>;
}

function IconAuth({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconDatabase({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function IconApi({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}

function IconCloud({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}

function IconJobs({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconSecurity({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const modules = [
  {
    Icon: IconAuth,
    title: 'Authentication',
    description: 'JWT token generation, bcrypt password hashing, and protected routes with real login flows.',
    tags: ['JWT', 'bcrypt', 'middleware'],
    color: '#3b82f6',
    href: '/modules/authentication',
    featured: true,
  },
  {
    Icon: IconDatabase,
    title: 'Database Systems',
    description: 'MongoDB CRUD operations, data modeling, and indexed queries with live read/write tracing.',
    tags: ['MongoDB', 'Mongoose', 'indexes'],
    color: '#10b981',
    href: '/modules/database',
    featured: true,
  },
  {
    Icon: IconApi,
    title: 'REST API',
    description: 'Structured endpoints with validation, error handling, and distributed tracing.',
    tags: ['Express', 'REST', 'tracing'],
    color: '#8b5cf6',
    href: '/modules/rest-api',
    featured: false,
  },
  {
    Icon: IconCloud,
    title: 'Cloud Storage',
    description: 'File uploads to AWS S3 with pre-signed URL access control.',
    tags: ['AWS S3', 'pre-signed', 'multipart'],
    color: '#f59e0b',
    href: '/modules/cloud-storage',
    featured: false,
  },
  {
    Icon: IconJobs,
    title: 'Background Jobs',
    description: 'Async job queues with BullMQ workers and Redis.',
    tags: ['BullMQ', 'Redis', 'workers'],
    color: '#ef4444',
    href: '/modules/background-jobs',
    featured: false,
  },
  {
    Icon: IconSecurity,
    title: 'Security',
    description: 'Rate limiting, Helmet.js headers, and input sanitization.',
    tags: ['Helmet', 'rate-limit', 'sanitization'],
    color: '#06b6d4',
    href: '/modules/security',
    featured: false,
  },
];

const liveStats = [
  { label: 'API requests logged', target: 847 },
  { label: 'Background jobs run', target: 1204 },
  { label: 'Real-time events', target: 3891 },
  { label: 'Avg response time', target: 23, suffix: 'ms' },
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
        ctaLabel="Explore Dashboard"
        ctaHref="/dashboard"
      />

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32" style={{ paddingTop: 'var(--space-4)' }}>

        {/* Live Stats Counter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 rounded-[var(--radius-container)] overflow-hidden mb-20"
          style={{
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {liveStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="py-8 px-6 text-center relative"
              style={{ backgroundColor: 'var(--bg-card)' }}
            >
              {/* Separator lines between cells */}
              {i > 0 && (
                <div
                  className="absolute left-0 top-4 bottom-4 w-px"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                />
              )}
              <div
                className="font-bold mb-1.5 font-mono tabular-nums"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--accent)' }}
              >
                <CountUp target={stat.target} duration={1200 + i * 150} suffix={stat.suffix ?? ''} />
              </div>
              <div className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-3"
          >
            <span className="font-mono text-xs font-medium tracking-widest" style={{ color: 'var(--accent)' }}>
              // MODULES
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
            <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
              6 live systems
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold"
            style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)' }}
          >
            Core Modules
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mt-2"
            style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}
          >
            Each module demonstrates a real backend skill with live functionality you can trigger.
          </motion.p>
        </div>

        {/* Bento module grid */}
        <BioluminescentGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              className={mod.featured && i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <BioluminescentGridItem className="h-full">
                <Link href={mod.href} className="flex flex-col p-6 h-full group cursor-pointer">
                  {/* Icon container */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${mod.color}12`,
                      border: `1px solid ${mod.color}25`,
                      boxShadow: `0 0 16px ${mod.color}10`,
                    }}
                  >
                    <mod.Icon color={mod.color} />
                  </div>

                  {/* Title */}
                  <h3
                    className="font-semibold mb-2 transition-colors duration-200"
                    style={{ fontSize: 'var(--text-h3)', color: mod.color }}
                  >
                    {mod.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-4 flex-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {mod.description}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {mod.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${mod.color}0d`,
                          border: `1px solid ${mod.color}20`,
                          color: mod.color,
                          opacity: 0.85,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </BioluminescentGridItem>
            </motion.div>
          ))}
        </BioluminescentGrid>

        {/* Principles footer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[var(--radius-container)] p-8"
          style={{
            border: '1px solid rgba(59,130,246,0.18)',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 100%)',
            boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(59,130,246,0.1)',
          }}
        >
          <p className="font-mono mb-5 text-center" style={{ fontSize: 'var(--text-caption)', color: 'var(--accent)', letterSpacing: '0.04em' }}>
            // Three principles behind every feature
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0">
            {[
              { n: '01', label: 'Real backend capability', sub: 'Every feature runs on actual infrastructure' },
              { n: '02', label: 'Visual representation', sub: 'Data flow is animated and traceable' },
              { n: '03', label: 'Simple explanation', sub: 'Designed for engineers and recruiters alike' },
            ].map((item, i) => (
              <div
                key={item.n}
                className="flex flex-col items-center text-center px-6 py-2 relative"
              >
                {i > 0 && (
                  <div
                    className="hidden sm:block absolute left-0 top-2 bottom-2 w-px"
                    style={{ backgroundColor: 'rgba(59,130,246,0.15)' }}
                  />
                )}
                <span className="font-mono font-bold mb-2" style={{ fontSize: '1.6rem', color: 'rgba(59,130,246,0.25)' }}>
                  {item.n}
                </span>
                <span className="font-semibold mb-1" style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                  {item.sub}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
