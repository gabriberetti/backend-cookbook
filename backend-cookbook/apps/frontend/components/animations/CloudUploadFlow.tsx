'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BackendEvent } from '@/types';

interface CloudUploadFlowProps {
  events: BackendEvent[];
}

export function CloudUploadFlow({ events }: CloudUploadFlowProps) {
  const [uploading, setUploading] = useState(false);

  const cloudEvents = events.filter((e) => e.eventType === 'cloud');
  const lastCloud = cloudEvents[0];

  useEffect(() => {
    if (!lastCloud) return;
    setUploading(true);
    const t = setTimeout(() => setUploading(false), 1500);
    return () => clearTimeout(t);
  }, [lastCloud]);

  return (
    <div className="flex items-center gap-3 h-10">
      <AnimatePresence>
        {uploading && (
          <motion.div
            key="file-icon"
            className="w-5 h-6 rounded border flex items-center justify-center text-[10px] font-bold"
            style={{ borderColor: '#f59e0b', color: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)' }}
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 48, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            FILE
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs"
        style={{ borderColor: uploading ? '#f59e0b' : '#1e2d4a', color: '#f59e0b' }}
      >
        S3
      </div>
    </div>
  );
}
