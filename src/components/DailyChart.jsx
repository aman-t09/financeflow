import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { formatCompact } from '../utils/finance'

const tick = { fill: 'var(--muted)', fontSize: 12 }

export default function DailyChart({ data }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={tick} interval="preserveStartEnd" />
          <YAxis tickLine={false} axisLine={false} tick={tick} tickFormatter={formatCompact} width={48} />
          <Tooltip content={<ChartTooltip labelFormatter={(d) => `Day ${d}`} />} />
          <Area
            type="monotone"
            dataKey="spent"
            name="Spent"
            stroke="var(--accent)"
            strokeWidth={2}
            fill="url(#spendFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}