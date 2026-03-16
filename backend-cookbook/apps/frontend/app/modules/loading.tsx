import { Skeleton, ModuleCardSkeleton } from '@/components/ui/Skeleton';

export default function ModulesLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
      {/* Header */}
      <div className="mb-10 space-y-3">
        <Skeleton width={100} height={11} rounded="4px" />
        <Skeleton width={220} height={36} rounded="8px" />
        <Skeleton width={460} height={16} rounded="6px" />
      </div>

      {/* Progress strip */}
      <div
        className="rounded-[var(--radius-card)] px-6 py-4 mb-10 flex items-center gap-6"
        style={{
          border: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'var(--bg-card)',
        }}
      >
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center justify-between">
            <Skeleton width={110} height={12} rounded="4px" />
            <Skeleton width={55}  height={12} rounded="4px" />
          </div>
          <Skeleton height={8} rounded="full" />
        </div>
        <Skeleton width={42} height={28} rounded="full" />
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <ModuleCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
