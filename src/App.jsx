import { useState, useEffect } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import { makeSampleTransactions } from './data/constants'
import Sidebar from './components/Sidebar'
import Modal from './components/Modal'
import TransactionForm from './components/TransactionForm'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'

const NAV_ITEMS = [
  { name: 'Dashboard', icon: 'dashboard' },
  { name: 'Transactions', icon: 'list' },
  { name: 'Analytics', icon: 'chart' },
]

function App() {
  const [transactions, setTransactions] = useLocalStorage('financeflow-transactions', [])
  const [theme, setTheme] = useLocalStorage(
    'financeflow-theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  const [page, setPage] = useState('Dashboard')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // the transaction being edited, or null for "new"

  // Put the theme on <html data-theme="..."> so the CSS variables switch
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  // ---------- Actions ----------
  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (transaction) => {
    setEditing(transaction)
    setFormOpen(true)
  }

  const saveTransaction = (data) => {
    setTransactions((prev) =>
      editing
        ? prev.map((t) => (t.id === editing.id ? { ...t, ...data } : t))
        : [{ ...data, id: crypto.randomUUID() }, ...prev]
    )
    setFormOpen(false)
  }

  const deleteTransaction = (id) => {
    if (window.confirm('Delete this transaction?')) {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    }
  }

  // Adds sample data, skipping any that are already there
  const loadSamples = () =>
    setTransactions((prev) => {
      const existing = new Set(prev.map((t) => t.id))
      return [...makeSampleTransactions().filter((s) => !existing.has(s.id)), ...prev]
    })

  const clearAll = () => {
    if (window.confirm('Delete ALL transactions? This cannot be undone.')) setTransactions([])
  }

  // Removes only the sample transactions; your own entries stay
  const removeSamples = () => {
    if (window.confirm('Remove the sample transactions? Your own entries will stay.')) {
      setTransactions((prev) => prev.filter((t) => !String(t.id).startsWith('sample-')))
    }
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        items={NAV_ITEMS}
        active={page}
        onChange={setPage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-8 sm:py-9 lg:ml-60 lg:pb-9">
        {page === 'Dashboard' && (
          <DashboardPage
            transactions={transactions}
            onAdd={openAdd}
            onNavigate={setPage}
            onLoadSamples={loadSamples}
            onRemoveSamples={removeSamples}
            onClearAll={clearAll}
          />
        )}
        {page === 'Transactions' && (
          <TransactionsPage
            transactions={transactions}
            onAdd={openAdd}
            onEdit={openEdit}
            onDelete={deleteTransaction}
            onLoadSamples={loadSamples}
            onClearAll={clearAll}
          />
        )}
        {page === 'Analytics' && <AnalyticsPage transactions={transactions} />}
      </main>

      {formOpen && (
        <Modal title={editing ? 'Edit transaction' : 'Add transaction'} onClose={() => setFormOpen(false)}>
          <TransactionForm initial={editing} onSave={saveTransaction} onCancel={() => setFormOpen(false)} />
        </Modal>
      )}
    </div>
  )
}

export default App