export type CalculatorItem = {
  slug: string
  title: string
  description: string
}

export const calculators: CalculatorItem[] = [
  { slug: "emi", title: "EMI", description: "Loan EMI calculator" },
  { slug: "fd", title: "FD", description: "Fixed Deposit maturity and returns" },
  { slug: "ssy", title: "SSY", description: "Sukanya Samriddhi Yojana returns" },
  { slug: "ppf", title: "PPF", description: "Public Provident Fund returns" },
  { slug: "epf", title: "EPF", description: "Employee Provident Fund returns" },
]
