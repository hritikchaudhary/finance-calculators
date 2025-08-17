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
  { slug: "hra", title: "HRA", description: "House Rent Allowance exemption" },
  { slug: "retirement", title: "Retirement", description: "Retirement corpus requirement" },
  { slug: "emi", title: "EMI", description: "Loan EMI calculator" },
  { slug: "car-loan-emi", title: "Car Loan EMI", description: "Car loan EMI calculator" },
  { slug: "home-loan-emi", title: "Home Loan EMI", description: "Home loan EMI calculator" },
  { slug: "simple-interest", title: "Simple Interest", description: "Simple interest on loans/schemes" },
  { slug: "compound-interest", title: "Compound Interest", description: "Compound interest returns" },
  { slug: "nsc", title: "NSC", description: "National Savings Certificate returns" },
  { slug: "step-up-sip", title: "Step Up SIP", description: "SIP with yearly step-up" },
  { slug: "income-tax", title: "Income Tax", description: "Payable income tax" },
  { slug: "gratuity", title: "Gratuity", description: "Gratuity at retirement" },
  { slug: "apy", title: "APY", description: "Atal Pension Yojana" },
  { slug: "cagr", title: "CAGR", description: "Compound annual growth rate" },
  { slug: "gst", title: "GST", description: "Goods and Services Tax" },
  { slug: "flat-vs-reducing", title: "Flat vs Reducing", description: "Compare EMI methods" },
  { slug: "brokerage", title: "Brokerage", description: "Brokerage and other charges" },
  { slug: "margin", title: "Margin", description: "Delivery and intraday margin" },
  { slug: "tds", title: "TDS", description: "Tax deducted at source" },
  { slug: "salary", title: "Salary", description: "Net take-home salary" },
  { slug: "inflation", title: "Inflation", description: "Inflation-adjusted prices" },
  { slug: "post-office-mis", title: "Post Office MIS", description: "Monthly income scheme" },
  { slug: "scss", title: "SCSS", description: "Senior Citizen Savings Scheme" },
  { slug: "stock-average", title: "Stock Average", description: "Average price of stock buys" },
  { slug: "xirr", title: "XIRR", description: "Extended IRR for cashflows" },
]
