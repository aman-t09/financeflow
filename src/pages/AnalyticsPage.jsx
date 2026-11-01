import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DailyChart from '../components/DailyChart'
import CategoryDonut from '../components/CategoryDonut'
import { categoryColor } from '../data/constants'
import {
  categoryBreakdown,
  currentMonthKey,
  dailySpending,
  formatMoney,
  monthKey,
  monthLabel,
  monthsWithData,
  prevMonthKey,
  todayStr,
  totals,
} from '../utils/finance'

export default function AnalyticsPage({ transactions }) {
  const [month, setMonth] = useState(currentMonthKey())

  const inMonth = transactions.filter((t) => monthKey(t.date) === month)
  const prev = totals(transactions.filter((t) => monthKey(t.date) === prevMonthKey(month)))
  const m = totals(inMonth)

  const [y, mo] = month.split('-').map(Number)
  const daysCounted = month === currentMonthKey() ? Number(todayStr().slice(8)) : new Date(y, mo, 0).getDate()
  const avgDaily = Math.round(m.expense / daysCounted)
  const savingsRate = m.income > 0 ? Math.round((m.balance / m.income) * 100) : 0

  let change = 'No data last month'
  if (prev.expense > 0) {
    const pct = Math.round(((m.expense - prev.expense) / prev.expense) * 100)
    change = `${pct >= 0 ? '↑' : '↓'} ${Math.abs(pct)}% vs last month`
  }

  const breakdown = categoryBreakdown(inMonth, categoryColor)

  return (
    <>
      <PageHeader title="Analytics" subtitle="Where your money goes.">
        <select className="field !w-auto" value={month} onChange={(e) => setMonth(e.target.value)}>
          {monthsWithData(transactions).map((k) => (
            <option key={k} value={k}>
              {monthLabel(k, true)}
            </option>
          ))}
        </select>
      </PageHeader>

      <div className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Income" value={formatMoney(m.income)} color="var(--income)" />
        <StatCard label="Expenses" value={formatMoney(m.expense)} color="var(--expense)" hint={change} />
        <StatCard label="Savings rate" value={`${savingsRate}%`} color="#ca8a04" />
        <StatCard label="Avg. daily spend" value={formatMoney(avgDaily)} color="var(--accent)" />
      </div>

      <section className="card mb-5">
        <h2 className="mb-4 font-heading text-[15px] font-semibold">Daily spending</h2>
        <DailyChart data={dailySpending(transactions, month)} />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-4 font-heading text-[15px] font-semibold">By category</h2>
          <CategoryDonut data={breakdown} />
        </section>

        <section className="card">
          <h2 className="mb-4 font-heading text-[15px] font-semibold">Ranked spending</h2>
          {breakdown.length === 0 ? (
            <p className="py-10 text-center text-sm text-subtle">No expenses this month.</p>
          ) : (
            <ul className="space-y-4">
              {breakdown.map((c) => {
                const pct = Math.round((c.value / m.expense) * 100)
                return (
                  <li key={c.name}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.fill }} />
                        {c.name}
                      </span>
                      <span className="tabular-nums text-muted">
                        {formatMoney(c.value)} · {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-chip">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.fill }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}