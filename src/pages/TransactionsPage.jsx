import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import TransactionList from '../components/TransactionList'
import { ALL_CATEGORY_NAMES } from '../data/constants'
import { formatMoney, monthKey, monthLabel, monthsWithData, sortByDate, totals } from '../utils/finance'

export default function TransactionsPage({
  transactions,
  onAdd,
  onEdit,
  onDelete,
  onLoadSamples,
  onClearAll,
}) {
  // Filters are temporary UI state, so they live here and are not saved
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')
  const [month, setMonth] = useState('all')

  const query = search.trim().toLowerCase()
  const visible = sortByDate(
    transactions.filter(
      (t) =>
        (type === 'all' || t.type === type) &&
        (category === 'all' || t.category === category) &&
        (month === 'all' || monthKey(t.date) === month) &&
        (t.note.toLowerCase().includes(query) || t.category.toLowerCase().includes(query))
    )
  )
  const sum = totals(visible)

  return (
    <>
      <PageHeader title="Transactions" subtitle="Every rupee in and out.">
        <button className="btn btn-ghost" onClick={onLoadSamples}>
          Load sample data
        </button>
        {transactions.length > 0 && (
          <button className="btn btn-ghost" onClick={onClearAll}>
            Clear all
          </button>
        )}
        <button className="btn btn-primary" onClick={onAdd}>
          + Add transaction
        </button>
      </PageHeader>

      <section className="card">
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className="field"
            placeholder="Search note or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="field" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {ALL_CATEGORY_NAMES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select className="field" value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="all">All time</option>
            {monthsWithData(transactions).map((k) => (
              <option key={k} value={k}>
                {monthLabel(k, true)}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-1 text-xs text-muted">
          {visible.length} shown · <span className="text-income">+{formatMoney(sum.income)}</span> in ·{' '}
          {formatMoney(sum.expense)} out
        </p>

        <TransactionList
          transactions={visible}
          onEdit={onEdit}
          onDelete={onDelete}
          emptyText={
            transactions.length === 0
              ? 'No transactions yet. Add one or load sample data.'
              : 'No transactions match your filters.'
          }
        />
      </section>
    </>
  )
}