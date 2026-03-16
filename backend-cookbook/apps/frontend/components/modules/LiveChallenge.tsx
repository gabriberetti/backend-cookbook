'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleChallenge } from '@/lib/modules';
import { BackendEvent } from '@/types';

// ─── Success burst particles ───────────────────────────────────────────────────

function SuccessBurst({ color }: { color: string }) {
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 2 * Math.PI;
    const dist = 48 + (i % 3) * 18;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 3 + (i % 4),
      delay: (i % 4) * 0.04,
    };
  });

  return (
    <div
      className="absolute pointer-events-none"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 0 }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            top: '50%',
            left: '50%',
            marginTop: -p.size / 2,
            marginLeft: -p.size / 2,
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 0.9 }}
          animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
          transition={{ duration: 0.65, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

// ─── Watching indicator ───────────────────────────────────────────────────────

function WatchingIndicator({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center w-5 h-5">
        <motion.div
          className="absolute w-full h-full rounded-full"
          style={{ backgroundColor: color, opacity: 0.2 }}
          animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Watching for backend events…
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface LiveChallengeProps {
  challenge: ModuleChallenge;
  events: BackendEvent[];
  color: string;
  slug: string;
  alreadyComplete: boolean;
  onComplete: () => void;
}

export function LiveChallenge({
  challenge, events, color, alreadyComplete, onComplete,
}: LiveChallengeProps) {
  const [complete, setComplete]       = useState(alreadyComplete);
  const [recentMatch, setRecentMatch] = useState<BackendEvent | null>(null);
  const [showBurst, setShowBurst]     = useState(false);
  const completedRef                  = useRef(alreadyComplete);

  useEffect(() => { completedRef.current = complete; }, [complete]);

  useEffect(() => {
    if (completedRef.current) return;
    const latest = events[0];
    if (!latest) return;
    if (challenge.verify(latest)) {
      setRecentMatch(latest);
      setComplete(true);
      setShowBurst(true);
      onComplete();
      setTimeout(() => setShowBurst(false), 800);
    }
  }, [events, challenge, onComplete]);

  return (
    <div
      className="rounded-[var(--radius-card)] overflow-hidden"
      style={{
        border: `1px solid ${complete ? `${color}40` : 'rgba(255,255,255,0.08)'}`,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%), var(--bg-card)',
        boxShadow: complete
          ? `var(--shadow-card), 0 0 32px ${color}12, inset 0 1px 0 rgba(255,255,255,0.04)`
          : 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{
          borderColor: complete ? `${color}20` : 'rgba(255,255,255,0.05)',
          backgroundColor: complete ? `${color}08` : 'rgba(255,255,255,0.01)',
          transition: 'background-color 0.4s',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative w-3 h-3 flex items-center justify-center">
            {!complete && (
              <motion.div
                className="absolute w-full h-full rounded-full"
                style={{ backgroundColor: color, opacity: 0.3 }}
                animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: complete ? color : '#475569' }}
            />
          </div>
          <span className="font-semibold" style={{
            fontSize: 'var(--text-body)',
            color: complete ? color : 'var(--text-primary)',
            transition: 'color 0.3s',
          }}>
            {complete ? 'Challenge Complete' : 'Live Challenge'}
          </span>
        </div>

        <AnimatePresence>
          {complete && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              className="font-mono px-3 py-1 rounded-full"
              style={{ fontSize: '12px', backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }}
            >
              +1 point
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="p-6 relative">
        <AnimatePresence mode="wait">
          {complete ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {showBurst && <SuccessBurst color={color} />}

              <div
                className="relative z-10 flex items-start gap-4 rounded-xl p-5"
                style={{
                  backgroundColor: `${color}08`,
                  border: `1px solid ${color}25`,
                  boxShadow: `inset 0 1px 0 ${color}15`,
                }}
              >
                {/* Checkmark icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20, delay: 0.1 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3,9 7,13 15,5" />
                  </svg>
                </motion.div>

                <div>
                  <p className="font-semibold mb-1" style={{ fontSize: 'var(--text-body)', color }}>
                    {challenge.successMessage}
                  </p>
                  {recentMatch && (
                    <p className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.8 }}>
                      Verified via: {recentMatch.message}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)', lineHeight: 1.75 }}>
                {challenge.instruction}
              </p>

              {/* Hint box */}
              <div
                className="rounded-xl p-4 flex items-start gap-3"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {challenge.hint}
                  </p>
                  {challenge.hintLink && (
                    <Link
                      href={challenge.hintLink}
                      className="font-mono mt-2 inline-flex items-center gap-1 hover:underline"
                      style={{ fontSize: '12px', color }}
                    >
                      Go there
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 8L8 2M4 2h4v4" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>

              <WatchingIndicator color={color} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
