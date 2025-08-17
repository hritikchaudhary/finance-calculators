// Centralized financial formulas for the NPS calculator
// All rates are provided in percentages where noted.

export interface CalculatorInputs {
  currentAge: number
  retirementAge: number
  currentCorpus: number
  expectedReturn: number // annual %
  inflation: number // annual %
  monthlyContribution: number
  contributionGrowth: number // annual % step-up applied once per year
  targetCorpus: number
  targetMonthlyPension: number
  annuityRate: number // annual % annuity yield
  annuityShare: number // % of corpus annuitized
}

export interface ProjectionData {
  age: number
  year: number
  corpus: number // nominal corpus
  realValue: number // inflation-adjusted corpus
  contribution: number // monthly contribution level for that year
}

// Helper: convert annual rate (%) to monthly rate (decimal)
export function monthlyRate(annualRatePct: number): number {
  const rAnnual = annualRatePct / 100
  return Math.pow(1 + rAnnual, 1 / 12) - 1
}

// Helper: future value of a lump sum with annual compounding
export function futureValueLumpSum(presentValue: number, annualRatePct: number, years: number): number {
  const rAnnual = annualRatePct / 100
  return presentValue * Math.pow(1 + rAnnual, Math.max(0, years))
}

// Helper: level-payment annuity factor with monthly compounding
export function annuityFactorMonthly(rMonthly: number, nMonths: number): number {
  if (nMonths <= 0) return 0
  if (Math.abs(rMonthly) < 1e-10) return nMonths
  return (Math.pow(1 + rMonthly, nMonths) - 1) / rMonthly
}

// -------- General-purpose calculators --------
// SIP FV with monthly contributions and monthly compounding
export function futureValueSIP(monthlyContribution: number, annualRatePct: number, years: number): number {
  const r = monthlyRate(annualRatePct)
  const n = Math.max(0, Math.round(years * 12))
  const af = annuityFactorMonthly(r, n)
  return monthlyContribution * af
}

// Required monthly SIP to reach a target future value given an initial corpus
export function sipRequiredForTarget(
  targetFV: number,
  currentCorpus: number,
  annualReturnPct: number,
  years: number
): number {
  return requiredMonthlyContribution(targetFV, currentCorpus, annualReturnPct, years)
}

// Mutual Fund combined FV = existing corpus (lumpsum) growth + SIP growth
export function futureValueMF(
  currentCorpus: number,
  monthlyContribution: number,
  annualReturnPct: number,
  years: number
): number {
  const fvLump = futureValueLumpSum(currentCorpus, annualReturnPct, years)
  const fvSip = futureValueSIP(monthlyContribution, annualReturnPct, years)
  return fvLump + fvSip
}

// PPF FV (yearly contribution, annual compounding)
export function futureValuePPF(yearlyContribution: number, annualRatePct: number, years: number, initial=0): number {
  const r = annualRatePct / 100
  const fvInitial = initial * Math.pow(1 + r, Math.max(0, years))
  if (years <= 0) return fvInitial
  if (Math.abs(r) < 1e-10) return fvInitial + yearlyContribution * years
  const af = (Math.pow(1 + r, years) - 1) / r // ordinary annuity, deposit at year-end
  return fvInitial + yearlyContribution * af
}

// EPF simple projection (monthly contributions from employee+employer on basic salary with annual growth, monthly compounding)
export function futureValueEPF(
  startingBasic: number,
  annualSalaryGrowthPct: number,
  employeePct: number,
  employerPct: number,
  epfRateAnnualPct: number,
  years: number
): number {
  const rMonthly = monthlyRate(epfRateAnnualPct)
  let basic = startingBasic
  let balance = 0
  for (let y = 0; y < Math.max(0, years); y++) {
    const monthlyEmployee = (employeePct / 100) * basic
    const monthlyEmployer = (employerPct / 100) * basic
    const monthlyContr = monthlyEmployee + monthlyEmployer
    for (let m = 0; m < 12; m++) {
      balance += monthlyContr
      balance *= 1 + rMonthly
    }
    basic *= 1 + annualSalaryGrowthPct / 100
  }
  return balance
}

// Effective target retirement corpus, depending on target type
export function effectiveTargetCorpus(
  targetType: "corpus" | "pension",
  targetCorpus: number,
  targetMonthlyPension: number,
  annuityRatePct: number,
  annuitySharePct: number
): number {
  if (targetType === "corpus") return Math.max(0, targetCorpus)
  const r = Math.max(0.0001, annuityRatePct / 100)
  const s = Math.max(0.0001, annuitySharePct / 100)
  return (Math.max(0, targetMonthlyPension) * 12) / (r * s)
}

// Required constant monthly contribution to reach a target FV with monthly compounding and yearly step-up applied separately in projections.
// This uses the standard annuity-immediate formula with monthly contributions for n months, ignoring step-up (good approximation for planning).
export function requiredMonthlyContribution(
  targetFV: number,
  currentCorpus: number,
  annualReturnPct: number,
  years: number
): number {
  const rAnnual = annualReturnPct / 100
  const rMonthly = monthlyRate(annualReturnPct)
  const nMonths = Math.max(0, Math.round(years * 12))
  const fvCurrent = currentCorpus * Math.pow(1 + rAnnual, Math.max(0, years))
  const af = annuityFactorMonthly(rMonthly, nMonths)
  if (af <= 0) return Math.max(0, targetFV - fvCurrent) // avoid divide by zero
  return Math.max(0, (targetFV - fvCurrent) / af)
}

// Build yearly projection using monthly contribution and compounding; contribution grows annually by contributionGrowth
export function buildProjection(
  inputs: CalculatorInputs,
  inflationAdjusted: boolean
): { data: ProjectionData[]; projectedCorpus: number } {
  const years = Math.max(0, inputs.retirementAge - inputs.currentAge)
  const rMonthly = monthlyRate(inputs.expectedReturn)
  const data: ProjectionData[] = []
  let corpus = inputs.currentCorpus
  let monthlyContrib = inputs.monthlyContribution

  for (let i = 0; i <= years; i++) {
    const age = inputs.currentAge + i
    const year = new Date().getFullYear() + i

    if (i > 0) {
      // simulate 12 months
      for (let m = 0; m < 12; m++) {
        corpus += monthlyContrib
        corpus *= 1 + rMonthly
      }
      // apply annual step-up
      monthlyContrib *= 1 + inputs.contributionGrowth / 100
    }

    const realValue = inflationAdjusted
      ? corpus / Math.pow(1 + inputs.inflation / 100, i)
      : corpus

    data.push({ age, year, corpus, realValue, contribution: monthlyContrib })
  }

  return { data, projectedCorpus: data[data.length - 1]?.corpus || 0 }
}
