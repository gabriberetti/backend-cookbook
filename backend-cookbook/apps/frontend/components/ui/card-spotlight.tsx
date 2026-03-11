'use client';

import { useMotionValue, motion, useMotionTemplate } from 'framer-motion';
import React, { useState, type MouseEvent as ReactMouseEvent } from 'react';
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import { cn } from '@/lib/utils';

export interface CardSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: number;
  color?: string;
  children: React.ReactNode;
  /** RGB array for dot matrix, e.g. [59, 130, 246] for blue */
  dotColor?: [number, number, number];
}

export function CardSpotlight({
  children,
  radius = 350,
  color = '#262626',
  className,
  dotColor = [59, 130, 246],
  ...props
}: CardSpotlightProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove({ currentTarget, clientX, clientY }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const maskImage = useMotionTemplate`radial-gradient(circle ${radius}px at ${mouseX}px ${mouseY}px, white, transparent)`;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-card)]',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {isHovering && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <CanvasRevealEffect colors={[dotColor]} showGradient />
        </div>
      )}
      <motion.div
        className="relative z-10 h-full w-full"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
