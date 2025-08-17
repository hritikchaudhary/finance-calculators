"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator, Target } from "lucide-react"
import { futureValueRD } from "@/lib/formulas"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { CalculatorHeader } from "@/components/CalculatorHeader"

export default function RDCalculatorPage() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(10000)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(5)

  const fv = useMemo(() => futureValueRD(monthlyDeposit, rate, years), [monthlyDeposit, rate, years])

  const projData = useMemo(() => {
    const arr: { year: number; value: number }[] = []
    for (let y = 0; y <= Math.max(0, years); y++) {
      arr.push({ year: y, value: futureValueRD(monthlyDeposit, rate, y) })
    }
    return arr
  }, [monthlyDeposit, rate, years])

  const invested = monthlyDeposit * 12 * Math.max(0, years)
  const gains = Math.max(0, fv - invested)

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)

  return (
    <div className="min-h-screen bg-background">
      <CalculatorHeader title="RD Calculator" subtitle="Recurring Deposit maturity and returns" Icon={Calculator} />

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Inputs</CardTitle>
              <CardDescription>Enter RD details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Monthly Deposit</Label>
                <Input type="number" value={monthlyDeposit} min={0} step={500} onChange={(e) => setMonthlyDeposit(Number(e.target.value))} />
              </div>
              <div className="space-y-3">
                <Label>
                  Interest Rate: <span className="font-semibold text-primary">{rate}%</span>
                </Label>
                <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={3} max={12} step={0.25} />
              </div>
              <div className="space-y-2">
                <Label>Years</Label>
                <Input type="number" value={years} min={1} max={15} onChange={(e) => setYears(Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Result</CardTitle>
              <CardDescription>Maturity amount and breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(fv)}</div>
              <div className="mt-2 text-sm text-muted-foreground">Future Value</div>
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
                    <YAxis tickFormatter={(v)=> new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(v as number)} tickLine={false} axisLine={false} width={80} />
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
