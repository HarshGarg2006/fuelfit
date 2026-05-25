export default function Skeleton({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${className}`}>&nbsp;</div>
      ))}
    </>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton w-4 h-4 rounded" />)}
        </div>
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
