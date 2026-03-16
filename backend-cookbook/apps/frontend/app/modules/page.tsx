'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MODULES } from '@/lib/modules';
import { useChallengeProgress } from '@/hooks/useChallengeProgress';

// ─── Per-slug SVG icons ───────────────────────────────────────────────────────

function ModuleIcon({ slug, color }: { slug: string; color: string }) {
  const s = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (slug) {
    case 'authentication':
      return <svg {...s}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
    case 'database':
      return <svg {...s}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 5v14c0 1.66-4.03 3-9 3S3 20.66 3 19V5" /><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" /></svg>;
    case 'rest-api':
      return <svg {...s}><path d="M2 12h20M12 2l8 10-8 10" /></svg>;
    case 'cloud-storage':
      return <svg {...s}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>;
    case 'background-jobs':
      return <svg {...s}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
    case 'security':
      return <svg {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    default:
      return <svg {...s}><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" /></svg>;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ModulesIndexPage() {
  const { getModuleScore, getTotalScore } = useChallengeProgress();
  const { earned, total } = getTotalScore();
  const pct = total > 0 ? (earned / total) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto px-6" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-10)' }}
      >
        <p className="font-mono mb-2" style={{ fontSize: '11px', color: 'var(--accent)', letterSpacing: '0.06em' }}>
          // 6 modules · {MODULES.length * 2} total points
        </p>
        <h1 className="font-bold mb-2" style={{ fontSize: 'var(--text-h1)', color: 'var(--text-primary)' }}>
          Backend Modules
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', maxWidth: 520 }}>
          Each module teaches a real backend concept through a step-by-step walkthrough, a live challenge, and a scenario question.
        </p>
      </motion.div>

      {/* Total progress strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="rounded-[var(--radius-card)] px-6 py-4 mb-10 flex items-center gap-6"
        style={{
          border: '1px solid rgba(59,130,246,0.18)',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, transparent 70%), var(--bg-card)',
          boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-mono" style={{ fontSize: '12px', color: 'var(--accent)' }}>
              Total Progress
            </span>
            <span className="font-mono font-bold" style={{ fontSize: '12px', color: 'var(--accent)' }}>
              {earned} / {total} pts
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
        <div
          className="font-mono font-bold shrink-0 px-3 py-1.5 rounded-full"
          style={{ fontSize: '13px', color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          {Math.round(pct)}%
        </div>
      </motion.div>

      {/* Module grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODULES.map((mod, i) => {
          const score   = getModuleScore(mod.slug);
          const percent = (score / 2) * 100;

          return (
            <motion.div
              key={mod.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/modules/${mod.slug}`} className="block h-full">
                <div
                  className="h-full rounded-[var(--radius-card)] p-5 transition-all group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%), var(--bg-card)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)',
                    transition: 'border-color 0.25s, box-shadow 0.25s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${mod.color}30`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `var(--shadow-card-hover), 0 0 32px ${mod.color}08, inset 0 1px 0 rgba(255,255,255,0.06)`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)';
                  }}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Icon container */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${mod.color}15`,
                          border: `1px solid ${mod.color}25`,
                          boxShadow: `0 0 16px ${mod.color}10`,
                        }}
                      >
                        <ModuleIcon slug={mod.slug} color={mod.color} />
                      </div>
                      <div>
                        <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: mod.color }}>
                          {mod.title}
                        </h2>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 1 }}>
                          {mod.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Score + dots */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full transition-colors"
                          style={{ backgroundColor: score >= 1 ? mod.color : 'rgba(255,255,255,0.1)' }}
                          title="Challenge"
                        />
                        <div
                          className="w-2 h-2 rounded-full transition-colors"
                          style={{ backgroundColor: score >= 2 ? mod.color : 'rgba(255,255,255,0.1)' }}
                          title="Scenario"
                        />
                      </div>
                      <span
                        className="font-mono"
                        style={{ fontSize: '11px', color: score === 2 ? mod.color : 'var(--text-secondary)', fontWeight: score === 2 ? 700 : 400 }}
                      >
                        {score}/2
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: mod.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>

                  {/* Arrow hint */}
                  <div
                    className="flex items-center justify-end mt-3 gap-1 opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{ color: mod.color, fontSize: '12px' }}
                  >
                    <span className="font-mono text-xs">Open module</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6h8M6 2l4 4-4 4" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* How challenges work */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 rounded-[var(--radius-card)] border p-6"
        style={{
          borderColor: 'rgba(255,255,255,0.06)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%), var(--bg-card)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <p className="font-mono mb-2" style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
          // How challenges work
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          Each module has 2 points: one for completing the live challenge (the frontend watches real backend events via Socket.io to verify), and one for answering the scenario question correctly. Progress is saved locally.
        </p>
      </motion.div>
    </div>
  );
}
