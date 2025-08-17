"use client"

import { useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator, Moon, Sun, Target } from "lucide-react"
import { loanEMI, loanOutstanding } from "@/lib/formulas"

export default function EMICalculatorPage() {
  const { theme, setTheme } = useTheme()
  const [principal, setPrincipal] = useState(2000000)
  const [rate, setRate] = useState(9)
  const [years, setYears] = useState(20)
  const [monthsPaid, setMonthsPaid] = useState(0)

  const emi = useMemo(() => loanEMI(principal, rate, years), [principal, rate, years])
  const outstanding = useMemo(() => loanOutstanding(principal, rate, years, monthsPaid), [principal, rate, years, monthsPaid])

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)

  const maxMonths = Math.max(1, Math.round(years * 12))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl border">
              <Calculator className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">EMI Calculator</h1>
              <p className="text-muted-foreground">Loan EMI and outstanding balance</p>
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
