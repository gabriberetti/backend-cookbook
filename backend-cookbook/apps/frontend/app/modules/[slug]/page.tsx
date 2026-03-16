'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { getModule, MODULES } from '@/lib/modules';
import { Walkthrough } from '@/components/modules/Walkthrough';
import { LiveChallenge } from '@/components/modules/LiveChallenge';
import { ScenarioChallenge } from '@/components/modules/ScenarioChallenge';
import { StatusDot } from '@/components/ui/StatusDot';

// ─── Section header with numbered badge ──────────────────────────────────────

function SectionHeader({ n, title, subtitle, color }: {
  n: number; title: string; subtitle: string; color: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0"
        style={{ fontSize: '14px', backgroundColor: color, color: '#fff', boxShadow: `0 0 16px ${color}40` }}
      >
        {n}
      </span>
      <div>
        <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
          {title}
        </h2>
        <p className="font-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.7 }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// ─── Module completion progress strip ────────────────────────────────────────

function CompletionStrip({ challengeDone, scenarioDone, color }: {
  challengeDone: boolean; scenarioDone: boolean; color: string;
}) {
  const steps = [
    { label: 'Walkthrough', done: true },
    { label: 'Challenge',   done: challengeDone },
    { label: 'Scenario',    done: scenarioDone },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="flex items-center gap-2 mb-8 px-4 py-2.5 rounded-xl"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          {i > 0 && (
            <div className="h-px w-6" style={{ backgroundColor: steps[i - 1].done ? `${color}40` : 'rgba(255,255,255,0.08)' }} />
          )}
          <div className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: step.done ? `${color}20` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${step.done ? `${color}50` : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {step.done ? (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1.5,4 3,5.5 6.5,2" />
                </svg>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              )}
            </div>
            <span
              className="font-mono text-xs"
              style={{ color: step.done ? color : 'var(--text-secondary)', opacity: step.done ? 1 : 0.5 }}
            >
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ModulePage() {
  const { slug }   = useParams<{ slug: string }>();
  const mod        = getModule(slug);
  const { connected, events }                                               = useSocket();
  const { progress, markChallengeComplete, markScenarioCorrect, getModuleScore } = useChallengeProgress();

  if (!mod) { notFound(); return null; }

  const score          = getModuleScore(mod.slug);
  const moduleProgress = progress[mod.slug];
  const currentIndex   = MODULES.findIndex(m => m.slug === slug);
  const prevModule     = currentIndex > 0 ? MODULES[currentIndex - 1] : null;
  const nextModule     = currentIndex < MODULES.length - 1 ? MODULES[currentIndex + 1] : null;

  const challengeDone = moduleProgress?.challengeComplete ?? false;
  const scenarioDone  = moduleProgress?.scenarioCorrect  ?? false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <Link
          href="/modules"
          className="font-mono inline-flex items-center gap-1 hover:underline transition-colors"
          style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2L4 6l4 4" />
          </svg>
          All Modules
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
        <span className="font-mono" style={{ fontSize: '13px', color: mod.color }}>
          {mod.title}
        </span>
      </motion.div>

      {/* Completion strip */}
      <CompletionStrip challengeDone={challengeDone} scenarioDone={scenarioDone} color={mod.color} />

      {/* Module header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-wrap items-start justify-between gap-5 mb-10"
      >
        <div className="flex items-start gap-4">
          {/* Color hexagon badge */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${mod.color}15`,
              border: `1px solid ${mod.color}30`,
              boxShadow: `0 0 24px ${mod.color}15`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={mod.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="8.5" x2="22" y2="8.5" />
              <line x1="2" y1="15.5" x2="22" y2="15.5" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold mb-1" style={{ fontSize: 'var(--text-h1)', color: 'var(--text-primary)' }}>
              {mod.title}
            </h1>
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)', maxWidth: '480px' }}>
              {mod.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <StatusDot connected={connected} label={connected ? 'Live' : 'Offline'} />
          <div
            className="px-3 py-1.5 rounded-full font-mono font-semibold"
            style={{
              fontSize: '12px',
              border: `1px solid ${mod.color}35`,
              color: mod.color,
              backgroundColor: `${mod.color}10`,
              boxShadow: score === 2 ? `0 0 12px ${mod.color}25` : 'none',
            }}
          >
            {score} / 2 pts
          </div>
        </div>
      </motion.div>

      {/* Recruiter pitch */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-[var(--radius-card)] p-6 mb-12"
        style={{
          border: `1px solid ${mod.color}22`,
          background: `linear-gradient(135deg, ${mod.color}07 0%, transparent 70%)`,
          boxShadow: `inset 0 1px 0 ${mod.color}12`,
        }}
      >
        <p className="font-mono mb-2" style={{ fontSize: '11px', color: mod.color, letterSpacing: '0.05em' }}>
          // What this demonstrates
        </p>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)', lineHeight: 1.75 }}>
          {mod.recruiterLine}
        </p>
      </motion.div>

      {/* Section 1: Walkthrough */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="mb-12"
      >
        <SectionHeader n={1} title="How it works" subtitle="Step-by-step walkthrough" color={mod.color} />
        <Walkthrough steps={mod.steps} color={mod.color} />
      </motion.section>

      {/* Section 2: Live challenge */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <SectionHeader n={2} title="Live Challenge" subtitle="Verified in real time against backend events" color={mod.color} />
        <LiveChallenge
          challenge={mod.challenge}
          events={events}
          color={mod.color}
          slug={mod.slug}
          alreadyComplete={challengeDone}
          onComplete={() => markChallengeComplete(mod.slug)}
        />
      </motion.section>

      {/* Section 3: Scenario */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="mb-16"
      >
        <SectionHeader n={3} title="Scenario Question" subtitle="Test your understanding" color={mod.color} />
        <ScenarioChallenge
          scenario={mod.scenario}
          color={mod.color}
          alreadyCorrect={scenarioDone}
          onCorrect={() => markScenarioCorrect(mod.slug)}
        />
      </motion.section>

      {/* Prev / Next navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        className="flex items-center justify-between pt-8 border-t gap-4"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        {prevModule ? (
          <Link href={`/modules/${prevModule.slug}`}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)', fontSize: '14px' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2L5 7l4 5" />
              </svg>
              {prevModule.title}
            </div>
          </Link>
        ) : <div />}

        {nextModule ? (
          <Link href={`/modules/${nextModule.slug}`}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all hover:opacity-80"
              style={{
                borderColor: `${nextModule.color}35`,
                color: nextModule.color,
                backgroundColor: `${nextModule.color}08`,
                fontSize: '14px',
              }}
            >
              {nextModule.title}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 2l4 5-4 5" />
              </svg>
            </div>
          </Link>
        ) : (
          <Link href="/modules">
            <div
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold"
              style={{ backgroundColor: 'var(--accent)', color: '#fff', fontSize: '14px' }}
            >
              All Modules
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 2l4 5-4 5" />
              </svg>
            </div>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
