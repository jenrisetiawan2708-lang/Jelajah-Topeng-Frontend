export default function PageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}
