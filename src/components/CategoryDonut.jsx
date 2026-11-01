import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { formatCompact, formatMoney } from '../utils/finance'

// data = [{ name, value, fill }] from categoryBreakdown()
export default function CategoryDonut({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (total === 0) {
    return <p className="py-10 text-center text-sm text-subtle">No expenses to chart yet.</p>
  }

  return (
    <div>
      <div className="relative mx-auto h-48 w-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              stroke="var(--surface)"
              strokeWidth={2}
            />
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-xs text-muted">Spent</p>
            <p className="font-heading text-lg font-bold">{formatCompact(total)}</p>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {data.slice(0, 5).map((d) => (
          <li key={d.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.fill }} />
              {d.name}
            </span>
            <span className="tabular-nums text-muted">{formatMoney(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}