import { Skeleton } from '@/components/ui/Skeleton';

// Next.js App Router route-level loading UI (shown during navigation Suspense)
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      {/* Page header skeleton */}
      <div className="mb-10 space-y-3">
        <Skeleton width={80}  height={11} rounded="4px" />
        <Skeleton width={260} height={36} rounded="8px" />
        <Skeleton width={400} height={16} rounded="6px" />
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {['#3b82f640', '#10b98140', '#8b5cf640', '#f59e0b40'].map((c) => (
          <div
            key={c}
            className="rounded-[var(--radius-card)] overflow-hidden flex"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%), var(--bg-card)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="w-1 shrink-0" style={{ backgroundColor: c }} />
            <div className="flex-1 px-5 py-4 space-y-2.5">
              <Skeleton height={28} width="50%" rounded="6px" />
              <Skeleton height={12} width="70%" rounded="4px" />
            </div>
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div
        className="rounded-[var(--radius-card)] border p-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <Skeleton width={160} height={18} rounded="6px" />
          <Skeleton width={80}  height={14} rounded="4px" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton width={60}  height={11} rounded="4px" />
              <Skeleton width={55}  height={18} rounded="8px" />
              <Skeleton width={`${45 + (i * 13) % 30}%`} height={11} rounded="4px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
