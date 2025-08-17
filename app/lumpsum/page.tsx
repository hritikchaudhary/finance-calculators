"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Calculator, Target } from "lucide-react"
import { futureValueLumpSum } from "@/lib/formulas"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { CalculatorHeader } from "@/components/CalculatorHeader"

export default function LumpsumCalculatorPage() {
  const [amount, setAmount] = useState(100000)
  const [expectedReturn, setExpectedReturn] = useState(12)
  const [years, setYears] = useState(10)
  const [showReal, setShowReal] = useState(false)
  const [inflation, setInflation] = useState(6)

  const fv = useMemo(() => futureValueLumpSum(amount, expectedReturn, years), [amount, expectedReturn, years])
  const invested = amount
  const gains = Math.max(0, fv - invested)

  const projData = useMemo(() => {
    const nYears = Math.max(0, years)
    const arr: { year: number; fv: number; real: number }[] = []
    for (let y = 0; y <= nYears; y++) {
      const value = futureValueLumpSum(amount, expectedReturn, y)
      const real = showReal ? value / Math.pow(1 + inflation / 100, y) : value
      arr.push({ year: y, fv: value, real })
    }
    return arr
  }, [amount, expectedReturn, years, showReal, inflation])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)

  return (
    <div className="min-h-screen bg-background">
      <CalculatorHeader title="Lumpsum Calculator" subtitle="Future value of a one-time investment" Icon={Calculator} />

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Inputs</CardTitle>
              <CardDescription>Enter investment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Investment Amount</Label>
                <Input type="number" value={amount} min={0} step={1000} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>
              <div className="space-y-3">
                <Label>
                  Expected Return: <span className="font-semibold text-primary">{expectedReturn}%</span>
                </Label>
                <Slider value={[expectedReturn]} onValueChange={([v]) => setExpectedReturn(v)} min={2} max={20} step={0.5} />
              </div>
              <div className="space-y-2">
                <Label>Years</Label>
                <Input type="number" value={years} min={1} max={50} onChange={(e) => setYears(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">Inflation-adjusted
                    <Switch checked={showReal} onCheckedChange={setShowReal} />
                  </Label>
                  <span className="text-sm text-muted-foreground">{inflation}%</span>
                </div>
                <Slider value={[inflation]} onValueChange={([v]) => setInflation(v)} min={0} max={12} step={0.5} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Result</CardTitle>
              <CardDescription>Projected corpus and breakdown</CardDescription>
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
                    <Area type="monotone" dataKey={showReal ? "real" : "fv"} stroke="#22c55e" strokeWidth={2.5} fill="rgba(34,197,94,0.2)" />
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
