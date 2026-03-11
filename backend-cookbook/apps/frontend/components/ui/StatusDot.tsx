'use client';

import { motion } from 'framer-motion';

interface StatusDotProps {
  connected: boolean;
  label?: string;
}

export function StatusDot({ connected, label }: StatusDotProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <motion.div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: connected ? 'var(--accent-emerald)' : '#ef4444' }}
          animate={connected ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
        {connected && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: 'var(--accent-emerald)' }}
            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
          />
        )}
      </div>
      {label && (
        <span className="font-mono" style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)' }}>
          {label}
        </span>
      )}
    </div>
  );
}
