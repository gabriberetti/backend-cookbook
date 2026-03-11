'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleScenario } from '@/lib/modules';

interface ScenarioChallengeProps {
  scenario: ModuleScenario;
  color: string;
  alreadyCorrect: boolean;
  onCorrect: () => void;
}

export function ScenarioChallenge({ scenario, color, alreadyCorrect, onCorrect }: ScenarioChallengeProps) {
  const [selected, setSelected] = useState<number | null>(alreadyCorrect ? scenario.correctIndex : null);
  const [revealed, setRevealed] = useState(alreadyCorrect);

  function handleSelect(i: number) {
    if (revealed) return;
    setSelected(i);
  }

  function handleSubmit() {
    if (selected === null || revealed) return;
    setRevealed(true);
    if (selected === scenario.correctIndex) {
      onCorrect();
    }
  }

  const isCorrect = selected === scenario.correctIndex;

  return (
    <div
      className="rounded-[var(--radius-card)] border overflow-hidden"
      style={{
        borderColor: revealed ? (isCorrect ? `${color}50` : '#ef444450') : 'var(--border)',
        backgroundColor: 'var(--bg-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: revealed && isCorrect ? `${color}08` : 'rgba(255,255,255,0.01)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <span className="font-semibold" style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)' }}>
            Scenario Challenge
          </span>
        </div>
        {revealed && isCorrect && (
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

      <div className="p-6 space-y-5">
        <p className="font-medium" style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)', lineHeight: 1.7 }}>
          {scenario.question}
        </p>

        <div className="space-y-2">
          {scenario.options.map((option, i) => {
            const isSelected = selected === i;
            const isRight = i === scenario.correctIndex;
            const isWrong = revealed && isSelected && !isRight;
            const showCorrect = revealed && isRight;

            let borderColor = 'var(--border)';
            let bgColor = 'transparent';
            let textColor = 'var(--text-secondary)';

            if (showCorrect) {
              borderColor = `${color}60`;
              bgColor = `${color}10`;
              textColor = color;
            } else if (isWrong) {
              borderColor = '#ef444460';
              bgColor = '#ef44440a';
              textColor = '#ef4444';
            } else if (isSelected && !revealed) {
              borderColor = `${color}40`;
              bgColor = `${color}08`;
              textColor = 'var(--text-primary)';
            }

            return (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                whileHover={!revealed ? { scale: 1.005, transition: { duration: 0.2 } } : {}}
                className="w-full text-left rounded-[var(--radius-button)] border p-4 transition-all flex items-start gap-3"
                style={{
                  borderColor,
                  backgroundColor: bgColor,
                  cursor: revealed ? 'default' : 'pointer',
                }}
              >
                <span
                  className="w-6 h-6 rounded-md border flex items-center justify-center font-bold flex-shrink-0 mt-0.5"
                  style={{
                    fontSize: '11px',
                    borderColor: showCorrect ? color : isWrong ? '#ef4444' : 'var(--border)',
                    backgroundColor: showCorrect ? color : isWrong ? '#ef4444' : 'transparent',
                    color: showCorrect || isWrong ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {showCorrect ? '✓' : isWrong ? '✕' : String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontSize: 'var(--text-body)', color: textColor, lineHeight: 1.6 }}>
                  {option}
                </span>
              </motion.button>
            );
          })}
        </div>

        {!revealed && (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="w-full py-3 rounded-[var(--radius-button)] font-semibold transition-all disabled:opacity-30"
            style={{ fontSize: 'var(--text-body)', backgroundColor: color, color: '#fff' }}
          >
            Submit Answer
          </button>
        )}

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[var(--radius-button)] border p-5"
              style={{
                borderColor: isCorrect ? `${color}30` : '#ef444430',
                backgroundColor: isCorrect ? `${color}06` : '#ef44440a',
              }}
            >
              <p
                className="font-semibold mb-2"
                style={{ fontSize: 'var(--text-caption)', color: isCorrect ? color : '#ef4444' }}
              >
                {isCorrect ? 'Correct!' : 'Not quite — here is the explanation:'}
              </p>
              <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {scenario.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
