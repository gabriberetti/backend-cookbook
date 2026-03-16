'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

function FloatingPaths({ position, color = '59, 130, 246' }: { position: number; color?: string }) {
  const paths = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    opacity: 0.05 + i * 0.006,
    width: 0.5 + i * 0.035,
  }));

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="-400 -200 1400 1200"
      preserveAspectRatio="xMidYMid slice"
    >
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          fill="none"
          stroke={`rgba(${color}, ${path.opacity})`}
          strokeWidth={path.width}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: path.id * 0.025, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </svg>
  );
}

function BlinkingCursor() {
  return (
    <motion.span
      className="inline-block w-[3px] ml-1 rounded-sm align-middle"
      style={{
        height: '0.85em',
        backgroundColor: 'var(--accent)',
        verticalAlign: 'middle',
        display: 'inline-block',
        marginBottom: '0.05em',
      }}
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
    />
  );
}

export interface BackgroundPathsProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function BackgroundPaths({
  title = 'Backend Cookbook',
  subtitle = 'A live, interactive platform that visually demonstrates how backend systems work — from authentication to cloud storage, background jobs to real-time event streams.',
  ctaLabel = 'Explore Dashboard',
  ctaHref = '/dashboard',
}: BackgroundPathsProps) {
  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-6 py-28 overflow-hidden">
      {/* Background path layers */}
      <FloatingPaths position={1} color="59, 130, 246" />
      <FloatingPaths position={-1} color="16, 185, 129" />

      {/* Radial vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(10,14,26,0.7) 100%)',
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">

        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-xs font-medium"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              color: 'var(--accent)',
              letterSpacing: '0.04em',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--accent-emerald)', boxShadow: '0 0 6px var(--accent-emerald)', animation: 'glow-pulse 2s ease-in-out infinite' }}
            />
            Production-grade backend · 6 live modules
          </span>
        </motion.div>

        {/* Main headline */}
        <h1
          className="mb-6 tracking-tight"
          style={{
            fontSize: 'clamp(2.6rem, 7vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          <motion.span
            className="block"
            style={{ color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Backend Engineering,
          </motion.span>
          <motion.span
            className="block"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 45%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            Visualized
            <BlinkingCursor />
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          className="mb-10 mx-auto"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '560px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          <Button asChild size="lg">
            <Link
              href={ctaHref}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: '1px solid rgba(59,130,246,0.4)',
                boxShadow: '0 0 24px rgba(59,130,246,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: 600,
                padding: '0 28px',
                height: '48px',
                fontSize: '0.9rem',
                letterSpacing: '0.01em',
              }}
            >
              {ctaLabel} →
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link
              href="/modules"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: 'var(--text-primary)',
                fontWeight: 500,
                padding: '0 28px',
                height: '48px',
                fontSize: '0.9rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              View Modules
            </Link>
          </Button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="flex flex-col items-center gap-1 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
            SCROLL
          </span>
          <motion.div
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, var(--text-secondary), transparent)' }}
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
