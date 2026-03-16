'use client';

import { CSSProperties } from 'react';

// ─── Shimmer keyframe is defined in globals.css ───────────────────────────────

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: string;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width = '100%', height = 16, rounded = '8px', className = '', style }: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: rounded,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.6s ease-in-out infinite',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

// ─── Stat card skeleton ────────────────────────────────────────────────────────

export function StatCardSkeleton({ accentColor = 'rgba(255,255,255,0.15)' }: { accentColor?: string }) {
  return (
    <div
      className="rounded-[var(--radius-card)] overflow-hidden flex"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%), var(--bg-card)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="w-1 shrink-0" style={{ backgroundColor: accentColor }} />
      <div className="flex-1 px-5 py-4 space-y-2.5">
        <Skeleton height={28} width="50%" rounded="6px" />
        <Skeleton height={12} width="70%" rounded="4px" />
      </div>
    </div>
  );
}

// ─── Event row skeleton ────────────────────────────────────────────────────────

export function EventRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
      <Skeleton width={60}  height={10} rounded="4px" />
      <Skeleton width={50}  height={18} rounded="8px" />
      <Skeleton width="60%" height={10} rounded="4px" />
    </div>
  );
}

// ─── Module card skeleton ──────────────────────────────────────────────────────

export function ModuleCardSkeleton() {
  return (
    <div
      className="rounded-[var(--radius-card)] p-5"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%), var(--bg-card)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex items-start gap-3 mb-5">
        <Skeleton width={40} height={40} rounded="12px" />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="55%" rounded="4px" />
          <Skeleton height={11} width="80%" rounded="4px" />
        </div>
        <Skeleton width={30} height={11} rounded="4px" />
      </div>
      <Skeleton height={4} rounded="4px" />
    </div>
  );
}
