'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const QUICK_LINKS = [
  { href: '/',              label: 'Home',         color: '#3b82f6' },
  { href: '/modules',       label: 'Modules',      color: '#10b981' },
  { href: '/dashboard',     label: 'Dashboard',    color: '#8b5cf6' },
  { href: '/architecture',  label: 'Architecture', color: '#f59e0b' },
];

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ paddingBottom: 'var(--space-24)' }}
    >
      {/* Glow behind 404 */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="relative z-10 max-w-lg w-full">

        {/* Terminal chrome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[var(--radius-container)] overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'var(--shadow-card-hover), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Title bar */}
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
              backend-cookbook ~ not-found
            </span>
          </div>

          {/* Terminal body */}
          <div
            className="p-6 font-mono"
            style={{ backgroundColor: 'var(--bg-primary)', fontSize: '13px' }}
          >
            {/* Prompt line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-1"
            >
              <span style={{ color: '#10b981' }}>➜</span>
              <span style={{ color: '#3b82f6' }}>~</span>
              <span style={{ color: 'var(--text-primary)' }}>GET /this-page-doesnt-exist</span>
            </motion.div>

            {/* Error output */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mb-4"
            >
              <span style={{ color: '#ef4444' }}>
                Error: 404 — Route not found
              </span>
            </motion.div>

            {/* Stack trace style */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="space-y-0.5 mb-5"
              style={{ color: '#374151', fontSize: '12px' }}
            >
              <p>  at Router.resolve (next/dist/server/router.js)</p>
              <p>  at getStaticProps (app/[...not-found]/page.tsx)</p>
              <p style={{ color: '#475569' }}>  hint: The page you requested does not exist.</p>
            </motion.div>

            {/* Blinking cursor line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex items-center gap-2"
            >
              <span style={{ color: '#10b981' }}>➜</span>
              <span style={{ color: '#3b82f6' }}>~</span>
              <motion.span
                style={{ color: 'var(--text-primary)' }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
              >
                █
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center my-8"
        >
          <div
            className="font-bold font-mono tabular-nums"
            style={{
              fontSize: 'clamp(4rem, 15vw, 7rem)',
              lineHeight: 1,
              background: 'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.08) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            404
          </div>
          <p className="mt-3" style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
            This route doesn&apos;t exist in the backend.
          </p>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono mb-4 text-center" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
            // Navigate to a valid route
          </p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all group"
                  style={{
                    borderColor: `${link.color}25`,
                    backgroundColor: `${link.color}06`,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${link.color}45`;
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = `${link.color}10`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${link.color}25`;
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = `${link.color}06`;
                  }}
                >
                  <span className="font-mono font-medium" style={{ fontSize: '13px', color: link.color }}>
                    {link.label}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={link.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 7h10M7 2l5 5-5 5" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
