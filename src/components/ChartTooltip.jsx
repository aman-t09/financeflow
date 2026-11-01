import { formatMoney } from '../utils/finance'

// Recharts calls this with { active, payload, label } whenever you hover.
export default function ChartTooltip({ active, payload, label, labelFormatter }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-lg">
      {label !== undefined && label !== '' && (
        <p className="mb-1 font-semibold">{labelFormatter ? labelFormatter(label) : label}</p>
      )}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? p.payload?.fill }} />
          {p.name}: <span className="font-medium text-ink">{formatMoney(p.value)}</span>
        </p>
      ))}
    </div>
  )
}