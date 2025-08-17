## India Finance Calculators

Modern, accurate personal finance calculators tailored for India. Built with Next.js, TypeScript, Tailwind (shadcn/ui), and Recharts.

### Stack
 - Next.js (App Router) + TypeScript
 - shadcn/ui + Tailwind CSS
 - Recharts, lucide-react

### Calculators
Implemented and available on the home page:
 - EMI (Loan)
 - FD (Fixed Deposit)
 - SSY (Sukanya Samriddhi Yojana)
 - PPF (Public Provident Fund)
 - EPF (Employee Provident Fund)

### Run locally
Requires Node 18+.

```bash
pnpm install   # or npm install / yarn
pnpm dev       # or npm run dev / yarn dev
```
Open http://localhost:3000

### Contributing (short)
 - Use small, focused PRs with screenshots for UI changes.
 - Keep formulas in `lib/formulas.ts`; prefer pure functions.
 - Keep currency formatting at exactly two decimals.

### License
See LICENSE. If you want to forbid commercial use, consider a source-available noncommercial license (e.g., PolyForm Noncommercial 1.0.0). Contact the author for commercial licensing.
