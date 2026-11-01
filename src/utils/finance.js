const pad = (n) => String(n).padStart(2, '0')

// ---------- Dates (all in the user's local time) ----------
export const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const monthKey = (dateStr) => dateStr.slice(0, 7) // "2026-11"
export const currentMonthKey = () => monthKey(todayStr())

export function monthLabel(key, long = false) {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString(
    'en-US',
    long ? { month: 'long', year: 'numeric' } : { month: 'short' }
  )
}

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function prevMonthKey(key) {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

export function lastNMonthKeys(n) {
  const now = new Date()
  const keys = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`)
  }
  return keys
}

// ---------- Money formatting ----------
const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})
const compact = new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 })

export const formatMoney = (n) => money.format(n)
export const formatCompact = (n) => compact.format(n)

// ---------- Calculations (pure functions: same input, same output) ----------
export function totals(list) {
  const income = list.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return { income, expense, balance: income - expense }
}

export function monthlyTrend(transactions, n = 6) {
  return lastNMonthKeys(n).map((key) => {
    const { income, expense } = totals(transactions.filter((t) => monthKey(t.date) === key))
    return { month: monthLabel(key), income, expense }
  })
}

// Expenses grouped by category, biggest first. "fill" is the key Recharts reads for colors.
export function categoryBreakdown(list, colorOf) {
  const map = {}
  list
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
  return Object.entries(map)
    .map(([name, value]) => ({ name, value, fill: colorOf(name) }))
    .sort((a, b) => b.value - a.value)
}

// One entry per day of the month (up to today if it's the current month)
export function dailySpending(list, key) {
  const [y, m] = key.split('-').map(Number)
  let days = new Date(y, m, 0).getDate()
  if (key === currentMonthKey()) days = Number(todayStr().slice(8))
  const data = Array.from({ length: days }, (_, i) => ({ day: i + 1, spent: 0 }))
  list.forEach((t) => {
    if (t.type === 'expense' && monthKey(t.date) === key) {
      const idx = Number(t.date.slice(8)) - 1
      if (data[idx]) data[idx].spent += t.amount
    }
  })
  return data
}

export function monthsWithData(transactions) {
  const set = new Set(transactions.map((t) => monthKey(t.date)))
  set.add(currentMonthKey())
  return [...set].sort().reverse()
}

export const sortByDate = (list) =>
  [...list].sort((a, b) => b.date.localeCompare(a.date) || String(b.id).localeCompare(String(a.id)))