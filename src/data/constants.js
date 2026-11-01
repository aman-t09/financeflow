import { todayStr } from '../utils/finance'

export const EXPENSE_CATEGORIES = [
  { name: 'Rent', color: '#b45309' },
  { name: 'Groceries', color: '#4d7c0f' },
  { name: 'Dining', color: '#c2410c' },
  { name: 'Transport', color: '#0e7490' },
  { name: 'Shopping', color: '#a21caf' },
  { name: 'Bills', color: '#4f46e5' },
  { name: 'Health', color: '#be123c' },
  { name: 'Entertainment', color: '#ca8a04' },
  { name: 'Education', color: '#0f766e' },
  { name: 'Other', color: '#78716c' },
]

export const INCOME_CATEGORIES = [
  { name: 'Salary', color: '#1b7a4b' },
  { name: 'Freelance', color: '#0d9488' },
  { name: 'Investments', color: '#65a30d' },
  { name: 'Gift', color: '#d97706' },
  { name: 'Other', color: '#78716c' },
]

export const categoriesFor = (type) => (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES)

export const ALL_CATEGORY_NAMES = [
  ...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map((c) => c.name)),
]

export const categoryColor = (name) =>
  [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].find((c) => c.name === name)?.color ?? '#78716c'

// Builds 6 months of believable transactions relative to today.
// Fixed ids ("sample-1"...) let us skip duplicates if the button is clicked twice.
export function makeSampleTransactions() {
  const pad = (n) => String(n).padStart(2, '0')
  const now = new Date()
  const rows = []
  let id = 1

  for (let b = 5; b >= 0; b--) {
    const d = new Date(now.getFullYear(), now.getMonth() - b, 1)
    const ym = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
    const add = (day, type, amount, category, note) =>
      rows.push({ id: `sample-${id++}`, type, amount, category, note, date: `${ym}-${pad(day)}` })

    add(1, 'income', 65000, 'Salary', 'Monthly salary')
    if (b % 2 === 0) add(14, 'income', 9000 + b * 500, 'Freelance', 'Freelance project')
    if (b === 3) add(20, 'income', 4000, 'Investments', 'Dividend payout')

    add(3, 'expense', 18000, 'Rent', 'House rent')
    add(5, 'expense', 3800 + ((b * 370) % 900), 'Groceries', 'Weekly groceries')
    add(19, 'expense', 3100 + ((b * 210) % 700), 'Groceries', 'Groceries top-up')
    add(8, 'expense', 2400, 'Bills', 'Electricity and internet')
    add(11, 'expense', 1500 + ((b * 260) % 800), 'Transport', 'Metro and cabs')
    add(16, 'expense', 2600 + ((b * 310) % 1200), 'Dining', 'Dinner with friends')
    add(22, 'expense', 3500 + ((b * 640) % 3000), 'Shopping', 'Clothes and household')
    if (b % 2 === 1) add(25, 'expense', 1800, 'Entertainment', 'Movies and subscriptions')
    if (b === 2) add(12, 'expense', 2200, 'Health', 'Doctor visit')
    if (b === 4) add(9, 'expense', 6000, 'Education', 'Online course')
  }

  // Drop anything dated in the future (late days of the current month)
  return rows.filter((r) => r.date <= todayStr())
}