"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator, Target } from "lucide-react"
import { futureValueSSY } from "@/lib/formulas"
import { CalculatorHeader } from "@/components/CalculatorHeader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts"

export default function SSYCalculatorPage() {
  const [yearlyContribution, setYearlyContribution] = useState(50000)
  const [rate, setRate] = useState(8)
  const [maturityYears, setMaturityYears] = useState(21)
  const [contribYears, setContribYears] = useState(15)
  const [initial, setInitial] = useState(0)
  const [chartMode, setChartMode] = useState<"pie" | "graph">("pie")

  const fv = useMemo(() => futureValueSSY(yearlyContribution, rate, maturityYears, contribYears, initial), [yearlyContribution, rate, maturityYears, contribYears, initial])
  const invested = useMemo(() => initial + yearlyContribution * Math.max(0, Math.min(contribYears, maturityYears)), [initial, yearlyContribution, contribYears, maturityYears])
  const gains = Math.max(0, fv - invested)

  const pieData = [
    { name: "Invested", value: Math.max(0, invested) },
    { name: "Gains", value: Math.max(0, gains) },
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

  const projData = useMemo(() => {
    const arr: { year: number; value: number }[] = []
    for (let y = 0; y <= Math.max(0, maturityYears); y++) {
      arr.push({ year: y, value: futureValueSSY(yearlyContribution, rate, y, contribYears, initial) })
    }
    return arr
  }, [yearlyContribution, rate, maturityYears, contribYears, initial])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)

  return (
    <div className="min-h-screen bg-background">
      <CalculatorHeader title="SSY Calculator" subtitle="Sukanya Samriddhi Yojana maturity value" Icon={Calculator} />

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Inputs</CardTitle>
              <CardDescription>Enter SSY details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Yearly Contribution</Label>
                <Input type="number" value={yearlyContribution} min={0} step={1000} onChange={(e) => setYearlyContribution(Number(e.target.value))} />
              </div>
              <div className="space-y-3">
                <Label>
                  Interest Rate: <span className="font-semibold text-primary">{rate}%</span>
                </Label>
                <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={6} max={10} step={0.1} />
              </div>
              <div className="space-y-2">
                <Label>Maturity Years</Label>
                <Input type="number" value={maturityYears} min={1} max={30} onChange={(e) => setMaturityYears(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Contribution Years</Label>
                <Input type="number" value={contribYears} min={1} max={maturityYears} onChange={(e) => setContribYears(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Initial Balance (optional)</Label>
                <Input type="number" value={initial} min={0} step={1000} onChange={(e) => setInitial(Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Result</CardTitle>
              <CardDescription>Maturity amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(fv)}</div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Invested</div>
                  <div className="text-xl font-semibold">{formatCurrency(invested)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Gains</div>
                  <div className="text-xl font-semibold">{formatCurrency(gains)}</div>
                </div>
              </div>

              <div className="mt-6">
                <Tabs value={chartMode} onValueChange={(v) => setChartMode(v as any)}>
                  <TabsList className="w-full">
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
                        {pieData.map((_, index) => (
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
                    <AreaChart data={projData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="year" tickLine={false} axisLine={false} />
                      <YAxis tickFormatter={(v)=> new Intl.NumberFormat("en-IN",{minimumFractionDigits:2, maximumFractionDigits:2}).format(v as number)} tickLine={false} axisLine={false} width={80} />
                      <Tooltip formatter={(v)=> formatCurrency(Number(v))} labelFormatter={(l)=> `Year ${l}`} />
                      <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} fill="rgba(34,197,94,0.2)" />
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
