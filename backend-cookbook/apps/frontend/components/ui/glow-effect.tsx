'use client';

import { cn } from '@/lib/utils';
import { motion, type Transition } from 'framer-motion';

export type GlowEffectProps = {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  mode?:
    | 'rotate'
    | 'pulse'
    | 'breathe'
    | 'colorShift'
    | 'flowHorizontal'
    | 'static';
  blur?:
    | number
    | 'softest'
    | 'soft'
    | 'medium'
    | 'strong'
    | 'stronger'
    | 'strongest'
    | 'none';
  transition?: Transition;
  scale?: number;
  duration?: number;
};

const blurMap = {
  softest: 'blur-sm',
  soft: 'blur',
  medium: 'blur-md',
  strong: 'blur-lg',
  stronger: 'blur-xl',
  strongest: 'blur-xl',
  none: 'blur-none',
} as const;

export function GlowEffect({
  className,
  style,
  colors = ['#3b82f6', '#06b6d4', '#8b5cf6'],
  mode = 'rotate',
  blur = 'medium',
  transition,
  scale = 1,
  duration = 5,
}: GlowEffectProps) {
  const baseTransition: Transition = {
    repeat: Infinity,
    duration: duration,
    ease: 'linear',
  };

  const animations = {
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(', ')})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(', ')})`,
      ],
      transition: transition ?? baseTransition,
    },
    pulse: {
      background: colors.map(
        (color) =>
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
      ),
      scale: [1 * scale, 1.1 * scale, 1 * scale],
      opacity: [0.5, 0.8, 0.5],
      transition: transition ?? { ...baseTransition, repeatType: 'reverse' as const },
    },
    breathe: {
      background: colors.map(
        (color) =>
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
      ),
      scale: [1 * scale, 1.05 * scale, 1 * scale],
      transition: transition ?? { ...baseTransition, repeatType: 'reverse' as const },
    },
    colorShift: {
      background: colors.map((_, index) => {
        const next = colors[(index + 1) % colors.length];
        return `conic-gradient(from 0deg at 50% 50%, ${colors[index]} 0%, ${next} 50%, ${colors[index]} 100%)`;
      }),
      transition: transition ?? { ...baseTransition, repeatType: 'reverse' as const },
    },
    flowHorizontal: {
      background: colors.map((color, i) => {
        const next = colors[(i + 1) % colors.length];
        return `linear-gradient(to right, ${color}, ${next})`;
      }),
      transition: transition ?? { ...baseTransition, repeatType: 'reverse' as const },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    },
  };

  const blurClass =
    typeof blur === 'number' ? undefined : blurMap[blur] ?? 'blur-md';
  const blurStyle = typeof blur === 'number' ? { filter: `blur(${blur}px)` } : undefined;

  const animate = animations[mode];
  const isStatic = mode === 'static';

  return (
    <motion.div
      className={cn('absolute -z-10 rounded-full', blurClass, className)}
      style={{ ...blurStyle, ...style }}
      animate={isStatic ? undefined : animate}
      initial={false}
    />
  );
}
