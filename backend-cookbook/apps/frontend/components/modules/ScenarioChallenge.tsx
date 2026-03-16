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
    if (selected === scenario.correctIndex) onCorrect();
  }

  const isCorrect = selected === scenario.correctIndex;

  return (
    <div
      className="rounded-[var(--radius-card)] overflow-hidden"
      style={{
        border: `1px solid ${
          revealed ? (isCorrect ? `${color}40` : 'rgba(239,68,68,0.35)') : 'rgba(255,255,255,0.08)'
        }`,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%), var(--bg-card)',
        boxShadow: revealed && isCorrect
          ? `var(--shadow-card), 0 0 32px ${color}12, inset 0 1px 0 rgba(255,255,255,0.04)`
          : 'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{
          borderColor: revealed && isCorrect ? `${color}20` : 'rgba(255,255,255,0.05)',
          backgroundColor: revealed && isCorrect ? `${color}08` : 'rgba(255,255,255,0.01)',
          transition: 'background-color 0.4s',
        }}
      >
        <div className="flex items-center gap-2.5">
          {/* Target SVG icon */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" fill={color} />
            </svg>
          </div>
          <span className="font-semibold" style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)' }}>
            Scenario Challenge
          </span>
        </div>

        <AnimatePresence>
          {revealed && isCorrect && (
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
      <div className="p-6 space-y-5">
        <p className="font-medium" style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)', lineHeight: 1.75 }}>
          {scenario.question}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {scenario.options.map((option, i) => {
            const isSelected  = selected === i;
            const isRight     = i === scenario.correctIndex;
            const isWrong     = revealed && isSelected && !isRight;
            const showCorrect = revealed && isRight;

            return (
              <motion.button
                key={i}
                onClick={() => handleSelect(i)}
                whileHover={!revealed ? { x: 2 } : {}}
                whileTap={!revealed ? { scale: 0.99 } : {}}
                transition={{ duration: 0.15 }}
                className="w-full text-left rounded-xl border p-4 flex items-start gap-3 transition-all"
                style={{
                  borderColor: showCorrect
                    ? `${color}50`
                    : isWrong
                    ? 'rgba(239,68,68,0.45)'
                    : isSelected && !revealed
                    ? `${color}35`
                    : 'rgba(255,255,255,0.07)',
                  backgroundColor: showCorrect
                    ? `${color}0c`
                    : isWrong
                    ? 'rgba(239,68,68,0.06)'
                    : isSelected && !revealed
                    ? `${color}08`
                    : 'rgba(255,255,255,0.02)',
                  cursor: revealed ? 'default' : 'pointer',
                  boxShadow: showCorrect ? `0 0 16px ${color}10` : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Letter badge */}
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center font-bold shrink-0 mt-0.5"
                  style={{
                    fontSize: '11px',
                    backgroundColor: showCorrect
                      ? color
                      : isWrong
                      ? '#ef4444'
                      : isSelected && !revealed
                      ? `${color}25`
                      : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${
                      showCorrect ? color : isWrong ? '#ef4444' : 'rgba(255,255,255,0.1)'
                    }`,
                    color: showCorrect || isWrong ? '#fff' : isSelected ? color : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {showCorrect ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1.5,5 4,7.5 8.5,2.5" />
                    </svg>
                  ) : isWrong ? '✕' : String.fromCharCode(65 + i)}
                </span>

                <span style={{
                  fontSize: 'var(--text-body)',
                  color: showCorrect ? color : isWrong ? '#ef4444' : 'var(--text-primary)',
                  lineHeight: 1.6,
                  opacity: revealed && !showCorrect && !isWrong ? 0.45 : 1,
                  transition: 'color 0.2s, opacity 0.2s',
                }}>
                  {option}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Submit */}
        {!revealed && (
          <motion.button
            onClick={handleSubmit}
            disabled={selected === null}
            whileHover={selected !== null ? { scale: 1.01 } : {}}
            whileTap={selected !== null ? { scale: 0.99 } : {}}
            className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-30"
            style={{
              fontSize: 'var(--text-body)',
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              color: '#fff',
              boxShadow: selected !== null ? `0 0 20px ${color}25` : 'none',
              border: `1px solid ${color}40`,
              transition: 'box-shadow 0.2s',
            }}
          >
            Submit Answer
          </motion.button>
        )}

        {/* Explanation */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl p-5"
              style={{
                border: `1px solid ${isCorrect ? `${color}25` : 'rgba(239,68,68,0.25)'}`,
                backgroundColor: isCorrect ? `${color}06` : 'rgba(239,68,68,0.04)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2,7 5.5,10.5 12,3.5" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="7" cy="7" r="6" />
                    <line x1="7" y1="4" x2="7" y2="7.5" />
                    <circle cx="7" cy="10" r="0.5" fill="#ef4444" />
                  </svg>
                )}
                <p className="font-semibold" style={{
                  fontSize: '13px',
                  color: isCorrect ? color : '#ef4444',
                }}>
                  {isCorrect ? 'Correct!' : 'Not quite — here is the explanation:'}
                </p>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {scenario.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
