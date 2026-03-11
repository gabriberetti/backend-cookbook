'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RequestPulseProps {
  active: boolean;
  color?: string;
}

export function RequestPulse({ active, color = '#3b82f6' }: RequestPulseProps) {
  const [pulses, setPulses] = useState<number[]>([]);

  useEffect(() => {
    if (!active) return;
    const id = Date.now();
    setPulses((p) => [...p, id]);
    const timer = setTimeout(() => {
      setPulses((p) => p.filter((x) => x !== id));
    }, 1500);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <div className="relative flex items-center justify-center w-6 h-6">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <AnimatePresence>
        {pulses.map((id) => (
          <motion.div
            key={id}
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${color}` }}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
