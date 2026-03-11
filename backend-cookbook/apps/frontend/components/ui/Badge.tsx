import { ReactNode } from 'react';
import { LogEventType } from '@/types';
import { EVENT_TYPE_BG, EVENT_TYPE_COLORS } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: LogEventType | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const colorClass = variant !== 'default' ? EVENT_TYPE_COLORS[variant] : 'text-slate-400';
  const bgClass = variant !== 'default' ? EVENT_TYPE_BG[variant] : 'bg-slate-500/10 border-slate-500/20';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-[var(--radius-badge)] font-mono border ${colorClass} ${bgClass} ${className}`}
      style={{ fontSize: 'var(--text-caption)' }}
    >
      {children}
    </span>
  );
}
