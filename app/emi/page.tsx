"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator, Target } from "lucide-react"
import { loanEMI, loanOutstanding } from "@/lib/formulas"
import { CalculatorHeader } from "@/components/CalculatorHeader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts"

export default function EMICalculatorPage() {
  const [principal, setPrincipal] = useState(2000000)
  const [rate, setRate] = useState(9)
  const [years, setYears] = useState(20)
  const [monthsPaid, setMonthsPaid] = useState(0)
  const [chartMode, setChartMode] = useState<"pie" | "graph">("pie")

  const emi = useMemo(() => loanEMI(principal, rate, years), [principal, rate, years])
  const outstanding = useMemo(() => loanOutstanding(principal, rate, years, monthsPaid), [principal, rate, years, monthsPaid])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)

  const maxMonths = Math.max(1, Math.round(years * 12))

  // Pie data: Principal vs Total Interest over the full loan
  const nMonths = Math.max(1, Math.round(years * 12))
  const totalPayment = emi * nMonths
  const totalInterest = Math.max(0, totalPayment - principal)
  const pieData = [
    { name: "Principal", value: Math.max(0, principal) },
    { name: "Interest", value: totalInterest },
  ]
  const PIE_FILL_COLORS = ["rgba(34,197,94,0.20)", "rgba(148,163,184,0.20)"]
  const PIE_STROKE_COLORS = ["#16a34a", "#334155"]

  const renderLegend = (props: any) => {
    const { payload } = props
    return (
      <ul className="flex justify-center gap-6 mt-2">
        {payload?.map((entry: any, i: number) => (
          <li key={`legend-${i}`} className="flex items-center gap-2 text-foreground">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: PIE_FILL_COLORS[i % PIE_FILL_COLORS.length], border: `2px solid ${PIE_STROKE_COLORS[i % PIE_STROKE_COLORS.length]}` }}
            />
            <span className="text-sm font-medium">{entry.value}</span>
          </li>
        ))}
      </ul>
    )
  }

  // Graph data: Outstanding by year
  const seriesData = useMemo(() => {
    const arr: { year: number; outstanding: number }[] = []
    const yrs = Math.max(0, Math.round(years))
    for (let y = 0; y <= yrs; y++) {
      const k = Math.min(y * 12, nMonths)
      arr.push({ year: y, outstanding: loanOutstanding(principal, rate, years, k) })
    }
    return arr
  }, [principal, rate, years, nMonths])

  return (
    <div className="min-h-screen bg-background">
      <CalculatorHeader title="EMI Calculator" subtitle="Loan EMI and outstanding balance" Icon={Calculator} />

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Inputs</CardTitle>
              <CardDescription>Enter loan details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Principal</Label>
                <Input type="number" value={principal} min={0} step={10000} onChange={(e) => setPrincipal(Number(e.target.value))} />
              </div>
              <div className="space-y-3">
                <Label>
                  Interest Rate: <span className="font-semibold text-primary">{rate}%</span>
                </Label>
                <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={4} max={18} step={0.1} />
              </div>
              <div className="space-y-2">
                <Label>Years</Label>
                <Input type="number" value={years} min={1} max={40} onChange={(e) => setYears(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Months Paid</Label>
                <Slider value={[monthsPaid]} onValueChange={([v]) => setMonthsPaid(v)} min={0} max={maxMonths} step={1} />
                <div className="text-sm text-muted-foreground">{monthsPaid} / {maxMonths} months</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Result</CardTitle>
              <CardDescription>Monthly EMI and outstanding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Monthly EMI</div>
                  <div className="text-3xl font-bold">{formatCurrency(emi)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Outstanding</div>
                  <div className="text-3xl font-bold">{formatCurrency(outstanding)}</div>
                </div>
              </div>

              <div className="mt-6">
                <Tabs value={chartMode} onValueChange={(v) => setChartMode(v as any)}>
                  <TabsList className="w-full focus:outline-none focus-visible:outline-none focus-visible:ring-0 ring-0">
                    <TabsTrigger value="pie" className="flex-1 focus:outline-none focus-visible:outline-none focus-visible:ring-0 ring-0">Breakdown</TabsTrigger>
                    <TabsTrigger value="graph" className="flex-1 focus:outline-none focus-visible:outline-none focus-visible:ring-0 ring-0">Timeline</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {chartMode === "pie" ? (
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip formatter={(v: number, n: string) => [formatCurrency(Number(v)), n]} />
                      <Legend verticalAlign="bottom" align="center" content={renderLegend} />
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        labelLine={false}
                        label={({ value, x, y }) => (
                          <text x={x} y={y} fill="var(--foreground)" textAnchor="middle" dominantBaseline="central" fontSize={12}>
                            {formatCurrency(Number(value))}
                          </text>
                        )}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_FILL_COLORS[index % PIE_FILL_COLORS.length]}
                            stroke={PIE_STROKE_COLORS[index % PIE_STROKE_COLORS.length]}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={seriesData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="year" tickLine={false} axisLine={false} />
                      <YAxis tickFormatter={(v)=> new Intl.NumberFormat("en-IN",{minimumFractionDigits:2, maximumFractionDigits:2}).format(v as number)} tickLine={false} axisLine={false} width={80} />
                      <Tooltip formatter={(v)=> formatCurrency(Number(v))} labelFormatter={(l)=> `Year ${l}`} />
                      <Area type="monotone" dataKey="outstanding" stroke="#22c55e" strokeWidth={2.5} fill="rgba(34,197,94,0.2)" name="Outstanding" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
