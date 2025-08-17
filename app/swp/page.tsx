"use client"

import { useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Calculator, Moon, Sun, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { swpFinalCorpus, monthlyRate } from "@/lib/formulas"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export default function SWPCalculatorPage() {
  const { theme, setTheme } = useTheme()
  const [initialCorpus, setInitialCorpus] = useState(1000000)
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(15000)
  const [expectedReturn, setExpectedReturn] = useState(10)
  const [years, setYears] = useState(10)
  const [showReal, setShowReal] = useState(false)
  const [inflation, setInflation] = useState(6)

  const finalCorpus = useMemo(() => swpFinalCorpus(initialCorpus, monthlyWithdrawal, expectedReturn, years), [initialCorpus, monthlyWithdrawal, expectedReturn, years])

  const projData = useMemo(() => {
    const r = monthlyRate(expectedReturn)
    const months = Math.max(0, Math.round(years * 12))
    let corpus = initialCorpus
    const arr: { month: number; year: number; value: number; real: number }[] = []
    for (let m = 0; m <= months; m++) {
      const y = Math.floor(m / 12)
      if (m > 0) {
        corpus *= 1 + r
        corpus -= monthlyWithdrawal
        if (corpus < 0) corpus = 0
      }
      const real = showReal ? corpus / Math.pow(1 + inflation / 100, y) : corpus
      if (m % 12 === 0) arr.push({ month: m, year: y, value: corpus, real })
      if (corpus <= 0) break
    }
    return arr
  }, [initialCorpus, monthlyWithdrawal, expectedReturn, years, showReal, inflation])

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)

  const depleted = finalCorpus <= 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl border">
              <Calculator className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SWP Calculator</h1>
              <p className="text-muted-foreground">Systematic Withdrawal Plan projection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                All calculators
              </Link>
            </Button>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-10 w-10">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Inputs</CardTitle>
              <CardDescription>Enter your SWP details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Initial Corpus</Label>
                <Input type="number" value={initialCorpus} min={0} step={10000} onChange={(e) => setInitialCorpus(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Monthly Withdrawal</Label>
                <Input type="number" value={monthlyWithdrawal} min={0} step={500} onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))} />
              </div>
              <div className="space-y-3">
                <Label>
                  Expected Return: <span className="font-semibold text-primary">{expectedReturn}%</span>
                </Label>
                <Slider value={[expectedReturn]} onValueChange={([v]) => setExpectedReturn(v)} min={4} max={20} step={0.5} />
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
              <CardDescription>Final corpus at end of period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(finalCorpus)}</div>
              {depleted && <div className="mt-2 text-sm text-red-500">Corpus depletes before or by the end of the selected period.</div>}

              <div className="mt-8 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(v)=> new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(v as number)} tickLine={false} axisLine={false} width={80} />
                    <Tooltip formatter={(v)=> formatCurrency(Number(v))} labelFormatter={(l)=> `Year ${l}`} />
                    <Line type="monotone" dataKey={showReal ? "real" : "value"} stroke="#22c55e" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
