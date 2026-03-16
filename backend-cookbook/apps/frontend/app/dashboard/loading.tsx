import { Skeleton, StatCardSkeleton, EventRowSkeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="space-y-2.5">
          <Skeleton width={90}  height={11} rounded="4px" />
          <Skeleton width={240} height={32} rounded="8px" />
          <Skeleton width={340} height={15} rounded="6px" />
        </div>
        <Skeleton width={80} height={28} rounded="full" />
      </div>

      {/* Service strip */}
      <div
        className="flex items-center gap-4 px-4 py-2.5 rounded-xl mb-8"
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Skeleton width={60} height={10} rounded="4px" />
        <div className="h-3 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} width={80} height={12} rounded="4px" />)}
      </div>

      {/* Metrics label */}
      <div className="flex items-center gap-3 mb-5">
        <Skeleton width={70} height={11} rounded="4px" />
        <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {['#8b5cf640', '#10b98140', '#3b82f640', '#f59e0b40'].map((c) => (
          <StatCardSkeleton key={c} accentColor={c} />
        ))}
      </div>

      {/* Activity label */}
      <div className="flex items-center gap-3 mb-5">
        <Skeleton width={100} height={11} rounded="4px" />
        <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
      </div>

      {/* Activity row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="rounded-[var(--radius-card)] border p-5 space-y-4" style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'var(--bg-card)' }}>
          <Skeleton width={140} height={16} rounded="6px" />
          <div className="flex justify-around py-4">
            {[60, 60, 60].map((s, i) => <Skeleton key={i} width={s} height={s} rounded="50%" />)}
          </div>
        </div>
        <div className="md:col-span-2 rounded-[var(--radius-card)] border p-5 space-y-3" style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'var(--bg-card)' }}>
          <div className="flex items-center justify-between mb-2">
            <Skeleton width={130} height={16} rounded="6px" />
            <Skeleton width={55}  height={12} rounded="4px" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => <EventRowSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
