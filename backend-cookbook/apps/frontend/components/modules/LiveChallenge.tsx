'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleChallenge } from '@/lib/modules';
import { BackendEvent } from '@/types';

interface LiveChallengeProps {
  challenge: ModuleChallenge;
  events: BackendEvent[];
  color: string;
  slug: string;
  alreadyComplete: boolean;
  onComplete: () => void;
}

export function LiveChallenge({
  challenge,
  events,
  color,
  alreadyComplete,
  onComplete,
}: LiveChallengeProps) {
  const [complete, setComplete] = useState(alreadyComplete);
  const [recentMatch, setRecentMatch] = useState<BackendEvent | null>(null);
  const completedRef = useRef(alreadyComplete);

  useEffect(() => {
    completedRef.current = complete;
  }, [complete]);

  useEffect(() => {
    if (completedRef.current) return;

    const latest = events[0];
    if (!latest) return;

    if (challenge.verify(latest)) {
      setRecentMatch(latest);
      setComplete(true);
      onComplete();
    }
  }, [events, challenge, onComplete]);

  return (
    <div
      className="rounded-[var(--radius-card)] border overflow-hidden"
      style={{
        borderColor: complete ? `${color}50` : 'var(--border)',
        backgroundColor: 'var(--bg-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{
          borderColor: complete ? `${color}30` : 'var(--border)',
          backgroundColor: complete ? `${color}08` : 'rgba(255,255,255,0.01)',
        }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: complete ? color : '#475569' }}
            animate={complete ? {} : { scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
          <span className="font-semibold" style={{ fontSize: 'var(--text-body)', color: complete ? color : 'var(--text-primary)' }}>
            {complete ? 'Challenge Complete' : 'Live Challenge'}
          </span>
        </div>
        {complete && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="font-mono px-3 py-1 rounded-full"
            style={{ fontSize: 'var(--text-caption)', backgroundColor: `${color}20`, color }}
          >
            +1 point
          </motion.span>
        )}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {complete ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3"
            >
              <div
                className="flex items-start gap-3 rounded-[var(--radius-button)] border p-4"
                style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
              >
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold mb-1" style={{ fontSize: 'var(--text-body)', color }}>
                    {challenge.successMessage}
                  </p>
                  {recentMatch && (
                    <p className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                      Verified via: {recentMatch.message}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                {challenge.instruction}
              </p>

              <div
                className="rounded-[var(--radius-button)] border p-4 flex items-start gap-3"
                style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <span className="text-lg">💡</span>
                <div>
                  <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {challenge.hint}
                  </p>
                  {challenge.hintLink && (
                    <Link
                      href={challenge.hintLink}
                      className="font-mono mt-2 inline-block hover:underline"
                      style={{ fontSize: 'var(--text-caption)', color }}
                    >
                      Go there →
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                />
                <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                  Watching for backend events...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
