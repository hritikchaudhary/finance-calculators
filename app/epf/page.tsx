"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator, Moon, Sun, Target } from "lucide-react"
import { futureValueEPF } from "@/lib/formulas"

export default function EPFCalculatorPage() {
  const { theme, setTheme } = useTheme()
  const [startingBasic, setStartingBasic] = useState(30000)
  const [annualGrowth, setAnnualGrowth] = useState(7)
  const [employeePct, setEmployeePct] = useState(12)
  const [employerPct, setEmployerPct] = useState(12)
  const [epfRate, setEpfRate] = useState(8.25)
  const [years, setYears] = useState(20)

  const fv = futureValueEPF(startingBasic, annualGrowth, employeePct, employerPct, epfRate, years)

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
              <h1 className="text-2xl font-bold tracking-tight">EPF Calculator</h1>
              <p className="text-muted-foreground">Employee Provident Fund balance projection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
              <CardDescription>Enter your EPF details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Starting Basic Salary (monthly)</Label>
                <Input type="number" value={startingBasic} min={0} step={1000} onChange={(e) => setStartingBasic(Number(e.target.value))} />
              </div>
              <div className="space-y-3">
                <Label>
                  Annual Salary Growth: <span className="font-semibold text-primary">{annualGrowth}%</span>
                </Label>
                <Slider value={[annualGrowth]} onValueChange={([v]) => setAnnualGrowth(v)} min={0} max={20} step={0.5} />
              </div>
              <div className="space-y-3">
                <Label>
                  Employee Contribution: <span className="font-semibold text-primary">{employeePct}%</span>
                </Label>
                <Slider value={[employeePct]} onValueChange={([v]) => setEmployeePct(v)} min={0} max={20} step={0.5} />
              </div>
              <div className="space-y-3">
                <Label>
                  Employer Contribution: <span className="font-semibold text-primary">{employerPct}%</span>
                </Label>
                <Slider value={[employerPct]} onValueChange={([v]) => setEmployerPct(v)} min={0} max={20} step={0.5} />
              </div>
              <div className="space-y-3">
                <Label>
                  EPF Interest Rate: <span className="font-semibold text-primary">{epfRate}%</span>
                </Label>
                <Slider value={[epfRate]} onValueChange={([v]) => setEpfRate(Number(v.toFixed(2)))} min={6} max={10} step={0.1} />
              </div>
              <div className="space-y-2">
                <Label>Years</Label>
                <Input type="number" value={years} min={1} max={40} onChange={(e) => setYears(Number(e.target.value))} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Result</CardTitle>
              <CardDescription>Projected EPF balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(fv)}</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
