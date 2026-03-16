'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 360); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{    opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollTop}
          aria-label="Scroll to top"
          className="fixed z-[9000] flex items-center justify-center"
          style={{
            bottom: 28,
            right: 28,
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: 'rgba(15, 22, 41, 0.88)',
            border: '1px solid rgba(59,130,246,0.25)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
            color: '#3b82f6',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          whileHover={{
            scale: 1.08,
            boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 16px rgba(59,130,246,0.2)',
          }}
          whileTap={{ scale: 0.94 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 13V3M3 8l5-5 5 5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
