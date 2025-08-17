export type CalculatorItem = {
  slug: string
  title: string
  description: string
}

export const calculators: CalculatorItem[] = [
  { slug: "sip", title: "SIP", description: "Save monthly or see how much you'll accumulate" },
  { slug: "lumpsum", title: "Lumpsum", description: "Returns for one-time investments" },
  { slug: "swp", title: "SWP", description: "Final amount with Systematic Withdrawal Plans" },
  { slug: "mf", title: "Mutual Fund", description: "Returns on mutual fund investments" },
  { slug: "ssy", title: "SSY", description: "Sukanya Samriddhi Yojana returns" },
  { slug: "ppf", title: "PPF", description: "Public Provident Fund returns" },
  { slug: "epf", title: "EPF", description: "Employee Provident Fund returns" },
  { slug: "fd", title: "FD", description: "Fixed Deposit maturity and returns" },
  { slug: "rd", title: "RD", description: "Recurring Deposit maturity and returns" },
  { slug: "nps", title: "NPS", description: "National Pension System planner" },
  { slug: "emi", title: "EMI", description: "Loan EMI calculator" },
]
