export default function DashboardLoading() {
  return (
    <div className="animate-fade-in space-y-4" aria-hidden="true">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200/60" />
      <div className="h-40 animate-pulse rounded-3xl bg-slate-200/60" />
      <div className="h-40 animate-pulse rounded-3xl bg-slate-200/60" />
    </div>
  );
}
