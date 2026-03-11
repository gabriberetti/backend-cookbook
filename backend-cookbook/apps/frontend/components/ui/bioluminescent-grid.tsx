'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const gridLineColor = 'rgba(59, 130, 246, 0.08)';
const itemBg = 'rgba(10, 14, 26, 0.6)';
const itemBorder = 'rgba(59, 130, 246, 0.2)';
const itemHoverBorder = 'rgba(59, 130, 246, 0.5)';
const glowColor1 = '#3b82f6';
const glowColor2 = '#06b6d4';

export const BioluminescentGridItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function BioluminescentGridItem({ className, children, ...props }, ref) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    };

    item.addEventListener('mousemove', handleMouseMove);
    return () => item.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const setRefs = (el: HTMLDivElement | null) => {
    (itemRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  return (
    <div
      ref={setRefs}
      className={cn(
        'relative rounded-[var(--radius-card)] border transition-colors duration-300',
        'before:absolute before:inset-0 before:rounded-[var(--radius-card)] before:opacity-0 before:transition-opacity before:duration-300',
        'before:content-[""] before:-z-10 before:bg-[radial-gradient(600px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(59,130,246,0.12),transparent_40%)]',
        'hover:before:opacity-100',
        'border-[var(--border)] hover:border-[var(--accent)]',
        className
      )}
      style={
        {
          '--mouse-x': '0px',
          '--mouse-y': '0px',
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
});

export const BioluminescentGrid = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function BioluminescentGrid({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative rounded-[var(--radius-container)] p-6',
        'before:absolute before:inset-0 before:rounded-[var(--radius-container)] before:content-[""] before:-z-10',
        'before:bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)]',
        'before:bg-[size:24px_24px]',
        className
      )}
      style={
        {
          '--grid-line': gridLineColor,
          '--item-bg': itemBg,
          '--item-border': itemBorder,
          '--item-hover-border': itemHoverBorder,
          '--glow-1': glowColor1,
          '--glow-2': glowColor2,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
});
