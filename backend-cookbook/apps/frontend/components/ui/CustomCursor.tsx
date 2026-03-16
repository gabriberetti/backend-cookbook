'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [visible, setVisible]     = useState(false);
  const [hovering, setHovering]   = useState(false);
  const [clicking, setClicking]   = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Ring lags behind dot for the trailing effect
  const springConfig = { stiffness: 220, damping: 24, mass: 0.4 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  // Track whether we're on a fine-pointer device to avoid showing on touch
  const isFine = useRef(false);

  useEffect(() => {
    isFine.current = window.matchMedia('(pointer: fine)').matches;
    if (!isFine.current) return;

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';

    function onMove(e: MouseEvent) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    }

    function onEnter() { setVisible(true); }
    function onLeave() { setVisible(false); }
    function onDown()  { setClicking(true); }
    function onUp()    { setClicking(false); }

    function onHoverStart(e: MouseEvent) {
      if ((e.target as Element).closest(INTERACTIVE)) setHovering(true);
    }
    function onHoverEnd(e: MouseEvent) {
      if ((e.target as Element).closest(INTERACTIVE)) setHovering(false);
    }

    document.addEventListener('mousemove',  onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseover',  onHoverStart);
    document.addEventListener('mouseout',   onHoverEnd);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseover',  onHoverStart);
      document.removeEventListener('mouseout',   onHoverEnd);
    };
  }, [cursorX, cursorY, visible]);

  // Don't render on touch/coarse-pointer devices (SSR safe: start hidden)
  return (
    <div aria-hidden="true" style={{ pointerEvents: 'none' }}>
      {/* Outer ring — lags behind */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 9999,
          borderRadius: '50%',
        }}
        animate={{
          width:   hovering ? 40 : clicking ? 22 : 32,
          height:  hovering ? 40 : clicking ? 22 : 32,
          opacity: visible ? 1 : 0,
          borderColor: hovering ? 'rgba(59,130,246,0.9)' : 'rgba(255,255,255,0.45)',
          backgroundColor: hovering ? 'rgba(59,130,246,0.08)' : 'transparent',
        }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="border"
      />

      {/* Inner dot — snaps to cursor instantly */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 9999,
          borderRadius: '50%',
        }}
        animate={{
          width:           hovering ? 5 : clicking ? 3 : 4,
          height:          hovering ? 5 : clicking ? 3 : 4,
          opacity:         visible ? 1 : 0,
          backgroundColor: hovering ? '#3b82f6' : '#fff',
          scale:           clicking ? 0.6 : 1,
        }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      />
    </div>
  );
}
