'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(59, 130, 246, ${0.08 + i * 0.005})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="-400 -200 1400 1200"
      preserveAspectRatio="xMidYMid slice"
    >
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          fill="none"
          stroke={path.color}
          strokeWidth={path.width}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: path.id * 0.02 }}
        />
      ))}
    </svg>
  );
}

export interface BackgroundPathsProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function BackgroundPaths({
  title = 'Backend Cookbook',
  subtitle = 'A gamified backend engineering showcase — real systems, visual explanations.',
  ctaLabel = 'Explore Dashboard',
  ctaHref = '/dashboard',
}: BackgroundPathsProps) {
  const words = title.split(' ');

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="mb-6" style={{ fontSize: 'var(--text-display)', fontWeight: 'var(--font-weight-bold)', lineHeight: 1.1 }}>
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block mr-3">
              {word.split('').map((letter, letterIndex) => (
                <motion.span
                  key={letterIndex}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: wordIndex * 0.1 + letterIndex * 0.02 }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>
        <motion.p
          className="text-[var(--text-secondary)] text-lg mb-10 max-w-2xl mx-auto"
          style={{ fontSize: 'var(--text-body)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Button asChild size="lg">
            <Link href={ctaHref}>{ctaLabel} →</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
