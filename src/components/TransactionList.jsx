import Icon from './Icon'
import { categoryColor } from '../data/constants'
import { formatDate, formatMoney } from '../utils/finance'

// onEdit / onDelete are optional: the dashboard shows a read-only list.
export default function TransactionList({ transactions, onEdit, onDelete, emptyText }) {
  if (transactions.length === 0) {
    return <p className="py-10 text-center text-sm text-subtle">{emptyText ?? 'Nothing here yet.'}</p>
  }

  return (
    <ul className="divide-y divide-line-soft">
      {transactions.map((t) => {
        const isIncome = t.type === 'income'
        const color = categoryColor(t.category)
        return (
          <li key={t.id} className="flex items-center gap-3 py-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold"
              style={{ background: `${color}22`, color }}
            >
              {t.category[0]}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t.note || t.category}</p>
              <p className="text-xs text-muted">
                {t.category} · {formatDate(t.date)}
              </p>
            </div>

            <p className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-income' : 'text-ink'}`}>
              {isIncome ? '+' : '−'}
              {formatMoney(t.amount)}
            </p>

            {(onEdit || onDelete) && (
              <div className="flex">
                {onEdit && (
                  <button
                    onClick={() => onEdit(t)}
                    aria-label={`Edit ${t.note || t.category}`}
                    className="rounded-lg p-2 text-subtle hover:bg-chip hover:text-ink"
                  >
                    <Icon name="edit" size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(t.id)}
                    aria-label={`Delete ${t.note || t.category}`}
                    className="rounded-lg p-2 text-subtle hover:bg-expense-soft hover:text-expense"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}