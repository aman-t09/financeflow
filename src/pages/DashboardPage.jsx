import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import TrendChart from '../components/TrendChart'
import CategoryDonut from '../components/CategoryDonut'
import TransactionList from '../components/TransactionList'
import { categoryColor } from '../data/constants'
import {
  categoryBreakdown,
  currentMonthKey,
  formatMoney,
  monthKey,
  monthLabel,
  monthlyTrend,
  sortByDate,
  totals,
} from '../utils/finance'

export default function DashboardPage({
  transactions,
  onAdd,
  onNavigate,
  onLoadSamples,
  onRemoveSamples,
  onClearAll,
}) {
  const month = currentMonthKey()

  if (transactions.length === 0) {
    return (
      <>
        <PageHeader title="Overview" subtitle={monthLabel(month, true)} />
        <div className="card py-14 text-center">
          <h2 className="font-heading text-xl font-bold">Nothing tracked yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Add your first income or expense, or load some sample data to see how the dashboard looks.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button className="btn btn-ghost" onClick={onLoadSamples}>
              Load sample data
            </button>
            <button className="btn btn-primary" onClick={onAdd}>
              + Add transaction
            </button>
          </div>
        </div>
      </>
    )
  }

  const hasSamples = transactions.some((t) => String(t.id).startsWith('sample-'))
  const thisMonth = transactions.filter((t) => monthKey(t.date) === month)
  const all = totals(transactions)
  const m = totals(thisMonth)
  const savingsRate = m.income > 0 ? Math.round((m.balance / m.income) * 100) : 0

  return (
    <>
      <PageHeader title="Overview" subtitle={monthLabel(month, true)}>
        {hasSamples && (
          <button className="btn btn-ghost" onClick={onRemoveSamples}>
            Remove sample data
          </button>
        )}
        <button className="btn btn-ghost" onClick={onClearAll}>
          Clear all
        </button>
        <button className="btn btn-primary" onClick={onAdd}>
          + Add transaction
        </button>
      </PageHeader>

      <div className="mb-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Balance" value={formatMoney(all.balance)} color="var(--accent)" hint="All time" />
        <StatCard label="Income" value={formatMoney(m.income)} color="var(--income)" hint="This month" />
        <StatCard label="Expenses" value={formatMoney(m.expense)} color="var(--expense)" hint="This month" />
        <StatCard label="Savings rate" value={`${savingsRate}%`} color="#ca8a04" hint="Of this month's income" />
      </div>

      <div className="mb-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <section className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-[15px] font-semibold">Income vs expenses</h2>
            <div className="flex gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-income" /> Income
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-expense" /> Expenses
              </span>
            </div>
          </div>
          <TrendChart data={monthlyTrend(transactions, 6)} />
        </section>

        <section className="card">
          <h2 className="mb-4 font-heading text-[15px] font-semibold">Spending this month</h2>
          <CategoryDonut data={categoryBreakdown(thisMonth, categoryColor)} />
        </section>
      </div>

      <section className="card">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-heading text-[15px] font-semibold">Recent transactions</h2>
          <button
            className="text-sm font-semibold text-accent-ink hover:underline"
            onClick={() => onNavigate('Transactions')}
          >
            View all
          </button>
        </div>
        <TransactionList transactions={sortByDate(transactions).slice(0, 5)} />
      </section>
    </>
  )
}