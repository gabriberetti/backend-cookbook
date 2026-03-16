'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalkthroughStep } from '@/lib/modules';

// ─── Syntax highlighter ───────────────────────────────────────────────────────

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'class', 'async', 'await', 'return',
  'if', 'else', 'try', 'catch', 'throw', 'import', 'from', 'export',
  'default', 'new', 'typeof', 'instanceof', 'for', 'while', 'of', 'in',
  'do', 'switch', 'case', 'break', 'continue', 'void', 'interface', 'type',
  'extends', 'implements', 'static', 'private', 'public', 'protected',
]);
const BOOLEANS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);

type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'boolean' | 'function' | 'operator' | 'default';
interface Token { text: string; type: TokenType }

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword:  '#c084fc',
  string:   '#86efac',
  comment:  '#64748b',
  number:   '#fbbf24',
  boolean:  '#fb923c',
  function: '#60a5fa',
  operator: '#94a3b8',
  default:  '#e2e8f0',
};

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Single-line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), type: 'comment' });
      break;
    }

    // String / template literal
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const q = line[i];
      let j = i + 1;
      while (j < line.length && !(line[j] === q && line[j - 1] !== '\\')) j++;
      tokens.push({ text: line.slice(i, j + 1), type: 'string' });
      i = j + 1;
      continue;
    }

    // Number
    if (/\d/.test(line[i]) && (i === 0 || !/[a-zA-Z_$]/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[\d.]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: 'number' });
      i = j;
      continue;
    }

    // Identifier
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      const afterWord = line.slice(j).trimStart();
      let type: TokenType = 'default';
      if (KEYWORDS.has(word)) type = 'keyword';
      else if (BOOLEANS.has(word)) type = 'boolean';
      else if (afterWord[0] === '(') type = 'function';
      tokens.push({ text: word, type });
      i = j;
      continue;
    }

    // Operators
    if (/[=+\-*/<>!&|?:;,{}[\]()]/.test(line[i])) {
      tokens.push({ text: line[i], type: 'operator' });
    } else {
      tokens.push({ text: line[i], type: 'default' });
    }
    i++;
  }

  return tokens;
}

// ─── Code block with terminal chrome ─────────────────────────────────────────

function CodeBlock({ code, stage }: { code: string; stage?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Terminal chrome */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ef4444', opacity: 0.7 }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#f59e0b', opacity: 0.7 }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10b981', opacity: 0.7 }} />
          </div>
          {stage && (
            <span
              className="font-mono ml-2"
              style={{ fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.7 }}
            >
              {stage}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="font-mono transition-colors"
          style={{ fontSize: '11px', color: copied ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}
          aria-label="Copy code"
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>

      {/* Code body */}
      <div
        className="overflow-x-auto"
        style={{ backgroundColor: '#080d19' }}
      >
        <table className="w-full border-collapse" style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '13px', lineHeight: 1.7 }}>
          <tbody>
            {lines.map((line, lineIndex) => (
              <tr key={lineIndex} className="group">
                {/* Line number */}
                <td
                  className="select-none pr-4 pl-4 text-right align-top"
                  style={{
                    color: 'rgba(255,255,255,0.15)',
                    borderRight: '1px solid rgba(255,255,255,0.04)',
                    minWidth: '2.5rem',
                    userSelect: 'none',
                    paddingTop: lineIndex === 0 ? '16px' : '1px',
                    paddingBottom: lineIndex === lines.length - 1 ? '16px' : '1px',
                    fontSize: '11px',
                  }}
                >
                  {lineIndex + 1}
                </td>
                {/* Code content */}
                <td
                  className="pl-5 pr-5"
                  style={{
                    paddingTop: lineIndex === 0 ? '16px' : '1px',
                    paddingBottom: lineIndex === lines.length - 1 ? '16px' : '1px',
                    whiteSpace: 'pre',
                  }}
                >
                  {line === '' ? '\u00a0' : tokenizeLine(line).map((tok, j) => (
                    <span key={j} style={{ color: TOKEN_COLORS[tok.type] }}>{tok.text}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Step progress bar ────────────────────────────────────────────────────────

function StepProgressBar({ steps, active, color, onSelect }: {
  steps: WalkthroughStep[];
  active: number;
  color: string;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="mb-6">
      {/* Segmented bar */}
      <div className="flex items-center gap-1 mb-3">
        {steps.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => onSelect(i)}
            className="flex-1 h-1 rounded-full transition-colors cursor-pointer"
            style={{
              backgroundColor: i <= active ? color : 'rgba(255,255,255,0.08)',
              boxShadow: i === active ? `0 0 8px ${color}60` : 'none',
            }}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>
      {/* Step pills — scrollable on mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all shrink-0"
            style={{
              fontSize: '12px',
              backgroundColor: i === active ? `${color}18` : 'transparent',
              border: `1px solid ${i === active ? `${color}40` : 'rgba(255,255,255,0.06)'}`,
              color: i === active ? color : i < active ? 'var(--text-secondary)' : 'var(--text-secondary)',
              opacity: i > active + 1 ? 0.5 : 1,
            }}
          >
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center font-bold shrink-0"
              style={{
                fontSize: '9px',
                backgroundColor: i < active ? color : i === active ? color : 'rgba(255,255,255,0.08)',
                color: i <= active ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {i < active ? (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1.5,4 3,5.5 6.5,2" />
                </svg>
              ) : i + 1}
            </span>
            <span className="hidden sm:inline font-mono">{step.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface WalkthroughProps {
  steps: WalkthroughStep[];
  color: string;
}

export function Walkthrough({ steps, color }: WalkthroughProps) {
  const [active, setActive] = useState(0);
  const current = steps[active]!;

  return (
    <div>
      <StepProgressBar steps={steps} active={active} color={color} onSelect={setActive} />

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[var(--radius-card)] overflow-hidden"
          style={{
            border: `1px solid ${color}25`,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%), var(--bg-card)',
            boxShadow: `var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.04)`,
          }}
        >
          {/* Card header */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ backgroundColor: `${color}0a`, borderColor: `${color}18` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold shrink-0"
                style={{ fontSize: '13px', backgroundColor: color, color: '#fff' }}
              >
                {active + 1}
              </span>
              <h3 className="font-semibold" style={{ fontSize: 'var(--text-body)', color }}>
                {current.title}
              </h3>
            </div>
            <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.6 }}>
              {active + 1} / {steps.length}
            </span>
          </div>

          {/* Card body */}
          <div className="p-6">
            <p style={{
              fontSize: 'var(--text-body)',
              color: 'var(--text-primary)',
              lineHeight: 1.75,
              marginBottom: current.code ? 'var(--space-5)' : 0,
            }}>
              {current.description}
            </p>

            {current.code && (
              <CodeBlock code={current.code} stage={current.stage} />
            )}
          </div>

          {/* Card footer nav */}
          <div
            className="px-6 py-4 border-t flex items-center justify-between gap-3"
            style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.01)' }}
          >
            <button
              onClick={() => setActive(a => Math.max(0, a - 1))}
              disabled={active === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border transition-all disabled:opacity-25"
              style={{ fontSize: '13px', borderColor: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2L4 6l4 4" />
              </svg>
              Prev
            </button>

            {/* Step dots */}
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === active ? '16px' : '6px',
                    height: '6px',
                    backgroundColor: i <= active ? color : 'rgba(255,255,255,0.15)',
                  }}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActive(a => Math.min(steps.length - 1, a + 1))}
              disabled={active === steps.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-25"
              style={{ fontSize: '13px', backgroundColor: color, color: '#fff' }}
            >
              Next
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 2l4 4-4 4" />
              </svg>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
