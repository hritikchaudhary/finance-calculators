"use client"

import { useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Calculator, Moon, Sun, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { futureValueSIP, monthlyRate, annuityFactorMonthly, sipRequiredForTarget } from "@/lib/formulas"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

export default function SIPCalculatorPage() {
  const { theme, setTheme } = useTheme()
  const [mode, setMode] = useState<"project" | "target">("project")
  const [monthlyContribution, setMonthlyContribution] = useState(10000)
  const [targetAmount, setTargetAmount] = useState(2500000)
  const [expectedReturn, setExpectedReturn] = useState(12)
  const [years, setYears] = useState(10)
  const [showReal, setShowReal] = useState(false)
  const [inflation, setInflation] = useState(6)

  const usedMonthly = useMemo(() => {
    if (mode === "project") return monthlyContribution
    const req = sipRequiredForTarget(targetAmount, 0, expectedReturn, years)
    return Math.round(req)
  }, [mode, monthlyContribution, targetAmount, expectedReturn, years])

  const fv = useMemo(() => futureValueSIP(usedMonthly, expectedReturn, years), [usedMonthly, expectedReturn, years])

  const invested = useMemo(() => usedMonthly * 12 * Math.max(0, years), [usedMonthly, years])
  const gains = Math.max(0, fv - invested)

  const projData = useMemo(() => {
    const r = monthlyRate(expectedReturn)
    const nYears = Math.max(0, years)
    const arr: { year: number; fv: number; real: number }[] = []
    for (let y = 0; y <= nYears; y++) {
      const n = y * 12
      const af = annuityFactorMonthly(r, n)
      const value = usedMonthly * af
      const real = showReal ? value / Math.pow(1 + inflation / 100, y) : value
      arr.push({ year: y, fv: value, real })
    }
    return arr
  }, [expectedReturn, years, usedMonthly, showReal, inflation])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl border">
              <Calculator className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SIP Calculator</h1>
              <p className="text-muted-foreground">Calculate how much your SIP can grow</p>
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
              <CardDescription>Enter your SIP details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Calculation Mode</Label>
                <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="project">Project Corpus</TabsTrigger>
                    <TabsTrigger value="target">Find Required SIP</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="space-y-2">
                <Label>Monthly Contribution</Label>
                <Input type="number" value={monthlyContribution} min={0} step={500} onChange={(e) => setMonthlyContribution(Number(e.target.value))} disabled={mode === "target"} />
              </div>
              {mode === "target" && (
                <div className="space-y-2">
                  <Label>Target Amount</Label>
                  <Input type="number" value={targetAmount} min={0} step={10000} onChange={(e) => setTargetAmount(Number(e.target.value))} />
                </div>
              )}
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
              <CardDescription>{mode === "target" ? "Required monthly SIP and projection" : "Projected corpus and breakdown"}</CardDescription>
            </CardHeader>
            <CardContent>
              {mode === "target" && (
                <div className="mb-4 text-sm text-muted-foreground">Required Monthly SIP:</div>
              )}
              <div className="text-3xl font-bold">{formatCurrency(mode === "target" ? usedMonthly : fv)}</div>
              {mode === "project" && (
                <div className="mt-2 text-sm text-muted-foreground">Future Value</div>
              )}

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
                  <LineChart data={projData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(v)=> new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(v as number)} tickLine={false} axisLine={false} width={80} />
                    <Tooltip formatter={(v)=> formatCurrency(Number(v))} labelFormatter={(l)=> `Year ${l}`} />
                    <Line type="monotone" dataKey={showReal ? "real" : "fv"} stroke="#22c55e" strokeWidth={2.5} dot={false} />
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
