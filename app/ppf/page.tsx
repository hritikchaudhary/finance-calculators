"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator, Target } from "lucide-react"
import { futureValuePPF } from "@/lib/formulas"
import { CalculatorHeader } from "@/components/CalculatorHeader"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function PPFCalculatorPage() {
  const [yearlyContribution, setYearlyContribution] = useState(150000)
  const [rate, setRate] = useState(7.1)
  const [years, setYears] = useState(15)
  const [initial, setInitial] = useState(0)

  const fv = useMemo(() => futureValuePPF(yearlyContribution, rate, years, initial), [yearlyContribution, rate, years, initial])
  const invested = useMemo(() => Math.max(0, initial + yearlyContribution * Math.max(0, years)), [initial, yearlyContribution, years])
  const gains = Math.max(0, fv - invested)

  const projData = useMemo(() => {
    const arr: { year: number; value: number }[] = []
    const nYears = Math.max(0, years)
    for (let y = 0; y <= nYears; y++) {
      arr.push({ year: y, value: futureValuePPF(yearlyContribution, rate, y, initial) })
    }
    return arr
  }, [yearlyContribution, rate, years, initial])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)

  return (
    <div className="min-h-screen bg-background">
      <CalculatorHeader title="PPF Calculator" subtitle="Public Provident Fund maturity value" Icon={Calculator} />

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Inputs</CardTitle>
              <CardDescription>Enter your PPF details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Yearly Contribution</Label>
                <Input type="number" value={yearlyContribution} min={0} step={1000} onChange={(e) => setYearlyContribution(Number(e.target.value))} />
              </div>
              <div className="space-y-3">
                <Label>
                  PPF Interest Rate: <span className="font-semibold text-primary">{rate}%</span>
                </Label>
                <Slider value={[rate]} onValueChange={([v]) => setRate(Number(v.toFixed(2)))} min={6} max={9} step={0.1} />
              </div>
              <div className="space-y-2">
                <Label>Years</Label>
                <Input type="number" value={years} min={1} max={25} onChange={(e) => setYears(Number(e.target.value))} />
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
              <CardDescription>Projected maturity value</CardDescription>
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

              <div className="mt-8 h-64">
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
