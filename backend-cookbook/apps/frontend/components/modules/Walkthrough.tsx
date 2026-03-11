'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalkthroughStep } from '@/lib/modules';

interface WalkthroughProps {
  steps: WalkthroughStep[];
  color: string;
}

export function Walkthrough({ steps, color }: WalkthroughProps) {
  const [active, setActive] = useState(0);

  const current = steps[active]!;

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 'var(--space-6)' }}>
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-mono border transition-all"
            style={{
              fontSize: 'var(--text-caption)',
              backgroundColor: i === active ? `${color}20` : 'transparent',
              borderColor: i === active ? `${color}60` : 'var(--border)',
              color: i === active ? color : 'var(--text-secondary)',
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center font-bold flex-shrink-0"
              style={{
                fontSize: '11px',
                backgroundColor: i < active ? color : i === active ? color : 'var(--border)',
                color: i <= active ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {i < active ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{step.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[var(--radius-card)] border overflow-hidden"
          style={{ borderColor: `${color}30`, boxShadow: 'var(--shadow-card)' }}
        >
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ backgroundColor: `${color}10`, borderColor: `${color}20` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                style={{ fontSize: 'var(--text-caption)', backgroundColor: color, color: '#fff' }}
              >
                {active + 1}
              </span>
              <h3 className="font-semibold" style={{ fontSize: 'var(--text-body)', color }}>
                {current.title}
              </h3>
            </div>
            <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
              {active + 1} / {steps.length}
            </span>
          </div>

          <div
            className="p-6"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 'var(--space-5)' }}>
              {current.description}
            </p>

            {current.code && (
              <div
                className="rounded-[var(--radius-button)] border p-5 font-mono overflow-x-auto"
                style={{
                  fontSize: 'var(--text-caption)',
                  backgroundColor: '#0a0e1a',
                  borderColor: 'var(--border)',
                  color: '#e2e8f0',
                  whiteSpace: 'pre',
                  lineHeight: 1.6,
                }}
              >
                {current.code}
              </div>
            )}
          </div>

          <div
            className="px-6 py-4 border-t flex items-center justify-between"
            style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.01)' }}
          >
            <button
              onClick={() => setActive((a) => Math.max(0, a - 1))}
              disabled={active === 0}
              className="px-4 py-2 rounded-[var(--radius-button)] border transition-all disabled:opacity-30"
              style={{ fontSize: 'var(--text-caption)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              ← Previous
            </button>
            <button
              onClick={() => setActive((a) => Math.min(steps.length - 1, a + 1))}
              disabled={active === steps.length - 1}
              className="px-4 py-2 rounded-[var(--radius-button)] font-semibold transition-all disabled:opacity-30"
              style={{ fontSize: 'var(--text-caption)', backgroundColor: color, color: '#fff' }}
            >
              Next →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
