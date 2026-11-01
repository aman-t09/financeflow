# FinanceFlow

Personal finance dashboard for tracking income, expenses, category-wise spending, and analytics, with interactive charts and a responsive interface.

**Live demo:** https://financeflow-onestop.vercel.app/


## Features

- Dashboard with balance, monthly income and expenses, savings rate, and a 6-month income vs expense chart
- Add, edit, and delete transactions, with search and filters by type, category, and month
- Analytics page with daily spending, category breakdown, ranked spending, and month-over-month comparison
- Interactive charts with custom hover tooltips (Recharts)
- Light and dark themes that follow the system preference and are remembered
- Responsive layout: sidebar on desktop, top bar and bottom tabs on mobile
- Sample data loader, plus options to remove sample data or clear everything
- Data persisted in the browser via localStorage

## Tech stack

- React (hooks, custom `useLocalStorage` hook)
- Vite
- Tailwind CSS, with theme tokens driven by CSS variables
- Recharts

## Project structure

```
src/
├── components/   reusable UI and chart components
├── pages/        Dashboard, Transactions, Analytics
├── hooks/        useLocalStorage
├── utils/        finance.js (pure calculation functions)
├── data/         categories and sample data
└── App.jsx       state, actions, page switching
```

## Design decisions

- All totals, trends, and category breakdowns are pure functions in `utils/finance.js`, so charts and stat cards always derive from one source of truth.
- Colors are CSS variables mapped to Tailwind tokens, so dark mode needs no per-component overrides.
- Persistence lives in one custom hook, so swapping localStorage for an API later changes a single file.

## Run locally

```bash
git clone https://github.com/aman-t09/financeflow.git
cd financeflow
npm install
npm run dev
```

## Limitations and future work

- No backend: data is stored per browser and does not sync across devices
- Planned: monthly budgets, recurring transactions, CSV/JSON export, Node/Express backend with authentication