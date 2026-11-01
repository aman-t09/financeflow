import Icon from './Icon'

export default function Sidebar({ items, active, onChange, theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-sidebar px-3.5 py-6 text-[#b9b3a7] lg:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2 font-heading text-xl font-bold tracking-tight text-white">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-base font-extrabold text-on-accent">
            F
          </span>
          FinanceFlow
        </div>

        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7c766b]">
          Menu
        </p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = active === item.name
            return (
              <button
                key={item.name}
                onClick={() => onChange(item.name)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors before:absolute before:-left-3.5 before:bottom-2 before:top-2 before:w-[3px] before:rounded-r before:bg-accent ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'before:hidden hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon name={item.icon} />
                {item.name}
              </button>
            )
          })}
        </nav>

        <button
          onClick={onToggleTheme}
          className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-[13px] font-medium transition-colors hover:bg-white/10"
        >
          <Icon name={isDark ? 'sun' : 'moon'} size={16} />
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-accent text-sm font-extrabold text-on-accent">
            F
          </span>
          FinanceFlow
        </div>
        <button onClick={onToggleTheme} aria-label="Toggle theme" className="rounded-lg p-2 text-muted hover:bg-chip">
          <Icon name={isDark ? 'sun' : 'moon'} />
        </button>
      </header>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-line bg-surface lg:hidden">
        {items.map((item) => {
          const isActive = active === item.name
          return (
            <button
              key={item.name}
              onClick={() => onChange(item.name)}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                isActive ? 'text-accent' : 'text-muted'
              }`}
            >
              <Icon name={item.icon} />
              {item.name}
            </button>
          )
        })}
      </nav>
    </>
  )
}