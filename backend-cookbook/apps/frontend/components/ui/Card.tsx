import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border ${glow ? 'glow-blue' : ''} ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {children}
    </div>
  );
}

export function AnimatedCard({ children, className = '', delay = 0 }: CardProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-[var(--radius-card)] border ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {children}
    </motion.div>
  );
}
