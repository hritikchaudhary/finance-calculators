"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calculator, Target } from "lucide-react"
import { futureValueSSY } from "@/lib/formulas"
import { CalculatorHeader } from "@/components/CalculatorHeader"

export default function SSYCalculatorPage() {
  const [yearlyContribution, setYearlyContribution] = useState(50000)
  const [rate, setRate] = useState(8)
  const [maturityYears, setMaturityYears] = useState(21)
  const [contribYears, setContribYears] = useState(15)
  const [initial, setInitial] = useState(0)

  const fv = useMemo(() => futureValueSSY(yearlyContribution, rate, maturityYears, contribYears, initial), [yearlyContribution, rate, maturityYears, contribYears, initial])

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)

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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
