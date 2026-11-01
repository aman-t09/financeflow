export default function StatCard({ label, value, color, hint }) {
  return (
    <div className="card !p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        {label}
      </p>
      <p className="mt-2 font-heading text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-subtle">{hint}</p>}
    </div>
  )
}