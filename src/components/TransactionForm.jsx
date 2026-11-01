import { useState } from 'react'
import { categoriesFor } from '../data/constants'
import { todayStr } from '../utils/finance'

export default function TransactionForm({ initial, onSave, onCancel }) {
  const [type, setType] = useState(initial?.type ?? 'expense')
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '')
  const [category, setCategory] = useState(initial?.category ?? categoriesFor('expense')[0].name)
  const [date, setDate] = useState(initial?.date ?? todayStr())
  const [note, setNote] = useState(initial?.note ?? '')
  const [error, setError] = useState('')

  // Changing the type also resets the category, since the lists differ
  const switchType = (next) => {
    setType(next)
    setCategory(categoriesFor(next)[0].name)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = Number(amount)
    if (!(value > 0)) {
      setError('Enter an amount greater than 0.')
      return
    }
    if (!date) {
      setError('Pick a date.')
      return
    }
    onSave({ type, amount: value, category, date, note: note.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Segmented control: Expense / Income */}
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-chip p-1">
        {['expense', 'income'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => switchType(t)}
            className={`rounded-md py-1.5 text-sm font-semibold capitalize transition-colors ${
              type === t ? 'bg-surface text-ink shadow-sm' : 'text-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-muted">Amount (₹)</span>
        <input
          className="field"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted">Category</span>
          <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoriesFor(type).map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-muted">Date</span>
          <input className="field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-muted">Note (optional)</span>
        <input
          className="field"
          placeholder="e.g. Weekly groceries"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      {error && <p className="text-sm text-expense">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initial ? 'Save changes' : 'Add transaction'}
        </button>
      </div>
    </form>
  )
}