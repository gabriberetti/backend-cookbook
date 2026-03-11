'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BackendEvent } from '@/types';

interface DatabaseWritePulseProps {
  events: BackendEvent[];
}

export function DatabaseWritePulse({ events }: DatabaseWritePulseProps) {
  const [flash, setFlash] = useState(false);

  const dbEvents = events.filter((e) => e.eventType === 'database');
  const lastDbEvent = dbEvents[0];

  useEffect(() => {
    if (!lastDbEvent) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 600);
    return () => clearTimeout(t);
  }, [lastDbEvent]);

  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      <motion.div
        className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
        animate={flash ? { borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.15)' } : { borderColor: '#1e2d4a', backgroundColor: 'transparent' }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-xs">DB</span>
      </motion.div>
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: '#10b981' }}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
