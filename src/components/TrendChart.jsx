import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ChartTooltip from './ChartTooltip'
import { formatCompact } from '../utils/finance'

const tick = { fill: 'var(--muted)', fontSize: 12 }

export default function TrendChart({ data }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={tick} />
          <YAxis tickLine={false} axisLine={false} tick={tick} tickFormatter={formatCompact} width={48} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--line-soft)' }} />
          <Bar dataKey="income" name="Income" fill="var(--income)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Expenses" fill="var(--expense)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}