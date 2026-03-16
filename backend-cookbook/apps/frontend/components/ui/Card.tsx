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
      className={`card-elevated rounded-[var(--radius-card)] ${glow ? 'glow-blue' : ''} ${className}`}
      style={{ padding: 'var(--space-6)' }}
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
      className={`card-elevated rounded-[var(--radius-card)] ${className}`}
      style={{ padding: 'var(--space-6)' }}
    >
      {children}
    </motion.div>
  );
}
