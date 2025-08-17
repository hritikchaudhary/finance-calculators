# India Finance Calculators

A collection of modern, accessible, and accurate personal finance calculators tailored for India. Built with Next.js, TypeScript, Recharts, and shadcn/ui. The goal is to provide clean UIs, consistent visuals, and trustworthy results for common instruments like EMI, FD, SSY, PPF, and more.

## Features

- **Consistent UI** using shared components like `CalculatorHeader` and standardized chart styles.
- **Dual visualization** pattern: default Pie breakdown with a toggle to Timeline (AreaChart) where relevant.
- **Accurate math** centralized in `lib/formulas.ts` and utilities in `lib/utils.ts`.
- **Two-decimal currency** formatting (₹) across tooltips, labels, and axes.
- **Responsive + accessible** components with keyboard support.

## Tech Stack

- **Framework**: Next.js (App Router), TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Icons**: lucide-react

## Available Calculators (examples)

- EMI (Loan)
- FD (Fixed Deposit)
- SSY (Sukanya Samriddhi Yojana)
- PPF (Public Provident Fund)
- EPF, NPS, SIP/Lumpsum (WIP; see `app/` and `lib/formulas.ts`)

## Project Structure

```
app/                 # Next.js routes per calculator
components/          # Shared UI components (including ui/* from shadcn)
hooks/               # Custom hooks
lib/                 # Financial formulas, calculators, helpers
public/              # Static assets
styles/              # Global styles (Tailwind)
```

## Getting Started

Prerequisites: Node 18+ and pnpm (preferred). You may use npm/yarn if you prefer.

1) Install deps

```bash
pnpm install
# or
npm install
# or
yarn
```

2) Run dev server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

3) Open the app

Visit http://localhost:3000

## Scripts

- `pnpm dev` – start dev server
- `pnpm build` – production build
- `pnpm start` – start production server
- `pnpm lint` – run linters (if configured)

## Contributing

Contributions are welcome! Please follow these guidelines to keep the project consistent and healthy.

### 1. Issues

- **Search first** to avoid duplicates.
- Use clear titles and include: steps to reproduce, expected vs actual, screenshots, and environment details.

### 2. Branching and PRs

- **Branch naming**: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`, `docs/<scope>`
  - e.g., `feat/rd-calculator`, `fix/emi-decimals`.
- Open **draft PRs** early for feedback.
- Keep PRs **small and focused**; add a concise description and screenshots for UI changes.
- Link related issues in the PR description.

### 3. Code Style

- Use **TypeScript** with strict typing where practical.
- Keep financial formulas in `lib/formulas.ts`; add unit tests where logic is non-trivial.
- Prefer **pure functions** for calculations; avoid coupling with UI concerns.
- Keep **currency formatting** to exactly two decimals across the app.
- Follow existing **chart styling** conventions (light fills, dark strokes for Pie; green stroke + light green fill for Area).
- Reuse shared components (e.g., `CalculatorHeader`, tabs, cards) for consistency.

### 4. UI/UX

- Ensure components are **responsive**.
- Use accessible labels and keyboard navigable controls.
- Maintain the **Pie default + Timeline toggle** pattern where a timeline is optional.

### 5. Commits

- Use clear messages: `feat: add SSY pie/timeline toggle`, `fix: format Y-axis to 2 decimals`.

### 6. Testing

- Add unit tests for new or modified formulas (recommended tooling: Vitest/Jest).
- For charts and pages, include screenshot references or manual test notes in PRs.

## Adding a New Calculator

1. Create a route under `app/<slug>/page.tsx`.
2. Add or extend formulas in `lib/formulas.ts` (with docs/comments and tests if complex).
3. Use `CalculatorHeader` and follow the established Pie/Timeline toggle pattern.
4. Ensure currency formatting to two decimals across UI and chart axes/tooltips.
5. Add inputs with sensible defaults and validation.
6. Ensure responsiveness and keyboard accessibility.

## Roadmap Ideas

- Remaining calculators: RD, SIP/Lumpsum, NPS enhancements, Mutual Funds, EPF refinements.
- Unit tests for formulas.
- I18N + theming refinements.
- Deployment guides (Vercel/Netlify).

## License

MIT. See `LICENSE` (to be added) or include license text in your PR if missing.

## Acknowledgements

- Built with Next.js, shadcn/ui, Tailwind, Recharts, and lucide-react.
- Thanks to contributors who help make Indian finance calculations more accessible.
