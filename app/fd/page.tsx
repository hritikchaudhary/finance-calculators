"use client"

import { useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Moon, Sun, Target } from "lucide-react"
import { futureValueFD } from "@/lib/formulas"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const freqMap: Record<string, number> = { yearly: 1, halfyearly: 2, quarterly: 4, monthly: 12 }

export default function FDCalculatorPage() {
  const { theme, setTheme } = useTheme()
  const [principal, setPrincipal] = useState(200000)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(5)
  const [freq, setFreq] = useState<keyof typeof freqMap>("quarterly")

  const fv = useMemo(() => futureValueFD(principal, rate, years, freqMap[freq]), [principal, rate, years, freq])

  const projData = useMemo(() => {
    const arr: { year: number; value: number }[] = []
    for (let y = 0; y <= Math.max(0, years); y++) {
      arr.push({ year: y, value: futureValueFD(principal, rate, y, freqMap[freq]) })
    }
    return arr
  }, [principal, rate, years, freq])

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl border">
              <Calculator className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FD Calculator</h1>
              <p className="text-muted-foreground">Fixed Deposit maturity and returns</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-10 w-10">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Inputs</CardTitle>
              <CardDescription>Enter FD details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Principal</Label>
                <Input type="number" value={principal} min={0} step={1000} onChange={(e) => setPrincipal(Number(e.target.value))} />
              </div>
              <div className="space-y-3">
                <Label>
                  Interest Rate: <span className="font-semibold text-primary">{rate}%</span>
                </Label>
                <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={3} max={12} step={0.25} />
              </div>
              <div className="space-y-2">
                <Label>Years</Label>
                <Input type="number" value={years} min={0.25} step={0.25} max={20} onChange={(e) => setYears(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Compounding</Label>
                <Select value={freq} onValueChange={(v) => setFreq(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Compounding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="halfyearly">Half-yearly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
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

              <div className="mt-8 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(v)=> new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(v as number)} tickLine={false} axisLine={false} width={80} />
                    <Tooltip formatter={(v)=> formatCurrency(Number(v))} labelFormatter={(l)=> `Year ${l}`} />
                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} dot={false} />
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
