'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MODULES } from '@/lib/modules';
import { useChallengeProgress } from '@/hooks/useChallengeProgress';
import { BioluminescentGrid, BioluminescentGridItem } from '@/components/ui/bioluminescent-grid';

export default function ModulesIndexPage() {
  const { getModuleScore, getTotalScore } = useChallengeProgress();
  const { earned } = getTotalScore();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-12)' }}
      >
        <h1 className="font-bold mb-2" style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)' }}>
          Backend Modules
        </h1>
        <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary)' }}>
          Each module teaches a real backend concept through a step-by-step walkthrough, a live challenge, and a scenario question.
        </p>

        <div
          className="mt-6 flex items-center gap-4 px-6 py-4 rounded-[var(--radius-card)] border"
          style={{ borderColor: 'rgba(59,130,246,0.2)', backgroundColor: 'rgba(59,130,246,0.05)' }}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--accent)' }}>Total Progress</span>
              <span className="font-mono font-bold" style={{ fontSize: 'var(--text-caption)', color: 'var(--accent)' }}>
                {earned} / {MODULES.length * 2} pts
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--accent)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(earned / (MODULES.length * 2)) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <BioluminescentGrid className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODULES.map((mod, i) => {
          const score = getModuleScore(mod.slug);
          const percent = (score / 2) * 100;

          return (
            <motion.div
              key={mod.slug}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <BioluminescentGridItem className="h-full">
                <Link href={`/modules/${mod.slug}`} className="block p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{mod.icon}</span>
                      <div>
                        <h2 className="font-semibold" style={{ fontSize: 'var(--text-h3)', color: mod.color }}>
                          {mod.title}
                        </h2>
                        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                          {mod.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: score >= 1 ? mod.color : 'var(--border)' }}
                          title="Challenge"
                        />
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: score >= 2 ? mod.color : 'var(--border)' }}
                          title="Scenario"
                        />
                      </div>
                      <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
                        {score}/2
                      </span>
                    </div>
                  </div>

                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: mod.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                    />
                  </div>
                </Link>
              </BioluminescentGridItem>
            </motion.div>
          );
        })}
      </BioluminescentGrid>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 rounded-[var(--radius-card)] border p-6"
        style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.01)' }}
      >
        <p className="font-mono mb-2" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
          // How challenges work
        </p>
        <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Each module has 2 points: one for completing the live challenge (the frontend watches real backend events via Socket.io to verify), and one for answering the scenario question correctly. Progress is saved locally.
        </p>
      </motion.div>
    </div>
  );
}
