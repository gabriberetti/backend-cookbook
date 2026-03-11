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

export default function ModulePage() {
  const { slug } = useParams<{ slug: string }>();
  const mod = getModule(slug);
  const { connected, events } = useSocket();
  const { progress, markChallengeComplete, markScenarioCorrect, getModuleScore } = useChallengeProgress();

  if (!mod) {
    notFound();
    return null;
  }

  const score = getModuleScore(mod.slug);
  const moduleProgress = progress[mod.slug];
  const currentIndex = MODULES.findIndex((m) => m.slug === slug);
  const prevModule = currentIndex > 0 ? MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex < MODULES.length - 1 ? MODULES[currentIndex + 1] : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-12)' }}
      >
        <div className="flex items-center gap-2 mb-6" style={{ marginBottom: 'var(--space-6)' }}>
          <Link
            href="/modules"
            className="font-mono hover:underline"
            style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}
          >
            ← All Modules
          </Link>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: mod.color }}>
            {mod.title}
          </span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl">{mod.icon}</span>
              <h1 className="font-bold" style={{ fontSize: 'var(--text-h1)', color: 'var(--text-primary)' }}>
                {mod.title}
              </h1>
            </div>
            <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
              {mod.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <StatusDot connected={connected} label={connected ? 'Live' : 'Offline'} />
            <div
              className="px-4 py-2 rounded-full font-mono border"
              style={{
                fontSize: 'var(--text-caption)',
                borderColor: `${mod.color}40`,
                color: mod.color,
                backgroundColor: `${mod.color}10`,
              }}
            >
              {score} / 2 pts
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[var(--radius-card)] border p-6 mb-10"
        style={{ borderColor: `${mod.color}30`, backgroundColor: `${mod.color}06`, marginBottom: 'var(--space-12)' }}
      >
        <p className="font-mono mb-2" style={{ fontSize: 'var(--text-caption)', color: mod.color }}>
          // What this is
        </p>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)', lineHeight: 1.7 }}>
          {mod.recruiterLine}
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ marginBottom: 'var(--space-12)' }}
      >
        <div className="flex items-center gap-3 mb-5" style={{ marginBottom: 'var(--space-6)' }}>
          <span
            className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center font-bold"
            style={{ fontSize: 'var(--text-body)', backgroundColor: mod.color, color: '#fff' }}
          >
            1
          </span>
          <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            How it works
          </h2>
          <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            Step-by-step walkthrough
          </span>
        </div>
        <Walkthrough steps={mod.steps} color={mod.color} />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: 'var(--space-12)' }}
      >
        <div className="flex items-center gap-3 mb-5" style={{ marginBottom: 'var(--space-6)' }}>
          <span
            className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center font-bold"
            style={{ fontSize: 'var(--text-body)', backgroundColor: mod.color, color: '#fff' }}
          >
            2
          </span>
          <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            Live Challenge
          </h2>
          <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            Verified in real time
          </span>
        </div>
        <LiveChallenge
          challenge={mod.challenge}
          events={events}
          color={mod.color}
          slug={mod.slug}
          alreadyComplete={moduleProgress?.challengeComplete ?? false}
          onComplete={() => markChallengeComplete(mod.slug)}
        />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ marginBottom: 'var(--space-16)' }}
      >
        <div className="flex items-center gap-3 mb-5" style={{ marginBottom: 'var(--space-6)' }}>
          <span
            className="w-8 h-8 rounded-[var(--radius-button)] flex items-center justify-center font-bold"
            style={{ fontSize: 'var(--text-body)', backgroundColor: mod.color, color: '#fff' }}
          >
            3
          </span>
          <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary)' }}>
            Scenario Question
          </h2>
          <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
            Test your understanding
          </span>
        </div>
        <ScenarioChallenge
          scenario={mod.scenario}
          color={mod.color}
          alreadyCorrect={moduleProgress?.scenarioCorrect ?? false}
          onCorrect={() => markScenarioCorrect(mod.slug)}
        />
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between pt-8 border-t"
        style={{ borderColor: 'var(--border)', paddingTop: 'var(--space-8)' }}
      >
        {prevModule ? (
          <Link href={`/modules/${prevModule.slug}`}>
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-[var(--radius-button)] border transition-all hover:bg-white/5"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', fontSize: 'var(--text-body)' }}
            >
              <span>←</span>
              <span>{prevModule.icon} {prevModule.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextModule ? (
          <Link href={`/modules/${nextModule.slug}`}>
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-[var(--radius-button)] border transition-all hover:bg-white/5"
              style={{ borderColor: nextModule.color + '40', color: nextModule.color, fontSize: 'var(--text-body)' }}
            >
              <span>{nextModule.icon} {nextModule.title}</span>
              <span>→</span>
            </div>
          </Link>
        ) : (
          <Link href="/modules">
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-[var(--radius-button)] font-semibold"
              style={{ backgroundColor: 'var(--accent)', color: '#fff', fontSize: 'var(--text-body)' }}
            >
              All Modules →
            </div>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
