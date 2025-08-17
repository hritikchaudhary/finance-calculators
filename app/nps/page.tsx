"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calculator, Target, TrendingUp, Moon, Sun, BarChart3, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"
import { buildProjection, effectiveTargetCorpus, requiredMonthlyContribution } from "@/lib/formulas"

interface CalculatorInputs {
  currentAge: number
  retirementAge: number
  currentCorpus: number
  expectedReturn: number
  inflation: number
  monthlyContribution: number
  contributionGrowth: number
  targetCorpus: number
  targetMonthlyPension: number
  annuityRate: number // Annual annuity yield % at retirement
  annuityShare: number // % of corpus annuitized at retirement
}

interface ProjectionData {
  age: number
  year: number
  corpus: number
  realValue: number
  contribution: number
}

export default function NPSCalculator() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [calculationMode, setCalculationMode] = useState<"contribution" | "target">("contribution")
  const [targetType, setTargetType] = useState<"corpus" | "pension">("corpus")
  const [inflationAdjusted, setInflationAdjusted] = useState(true)
  const [inputs, setInputs] = useState<CalculatorInputs>({
    currentAge: 30,
    retirementAge: 60,
    currentCorpus: 500000,
    expectedReturn: 12,
    inflation: 6,
    monthlyContribution: 10000,
    contributionGrowth: 5,
    targetCorpus: 10000000,
    targetMonthlyPension: 50000,
    annuityRate: 6.5,
    annuityShare: 40,
  })

  const [projectionData, setProjectionData] = useState<ProjectionData[]>([])
  const [requiredContribution, setRequiredContribution] = useState(0)
  const [projectedCorpus, setProjectedCorpus] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const years = inputs.retirementAge - inputs.currentAge

    if (calculationMode === "target") {
      // 1) Compute required monthly contribution
      const targetAmount = effectiveTargetCorpus(
        targetType,
        inputs.targetCorpus,
        inputs.targetMonthlyPension,
        inputs.annuityRate,
        inputs.annuityShare
      )
      const required = requiredMonthlyContribution(
        targetAmount,
        inputs.currentCorpus,
        inputs.expectedReturn,
        years
      )
      setRequiredContribution(required)

      // 2) Build projection using the required contribution (so UI reflects Find Contribution mode)
      const { data, projectedCorpus } = buildProjection(
        { ...inputs, monthlyContribution: required },
        inflationAdjusted
      )
      setProjectionData(data)
      setProjectedCorpus(projectedCorpus)
      return
    }

    // Contribution mode: use the user-entered monthly contribution
    const { data, projectedCorpus } = buildProjection(inputs, inflationAdjusted)
    setProjectionData(data)
    setProjectedCorpus(projectedCorpus)
  }, [inputs, inflationAdjusted, calculationMode, targetType])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Progress: show how close we are to target corpus
  // - In contribution mode: use projected corpus at retirement; if inflation adjusted, use real value
  // - In target mode: use current corpus today
  const latestReal = projectionData.length ? projectionData[projectionData.length - 1].realValue : 0
  const baseForProgress =
    calculationMode === "contribution"
      ? (inflationAdjusted ? latestReal : projectedCorpus)
      : inputs.currentCorpus

  // Effective target corpus for progress denominator
  const effectiveTargetForProgress = calculationMode === "target"
    ? effectiveTargetCorpus(
        targetType,
        inputs.targetCorpus,
        inputs.targetMonthlyPension,
        inputs.annuityRate,
        inputs.annuityShare
      )
    : inputs.targetCorpus

  const progressRaw = effectiveTargetForProgress > 0 ? (baseForProgress / effectiveTargetForProgress) * 100 : 0
  const progressPercentage = Math.min(Math.max(progressRaw, 0), 100)

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl border">
              <Calculator className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">NPS Retirement Calculator</h1>
              <p className="text-muted-foreground">Plan your retirement with confidence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-primary" />
                  Calculator Settings
                </CardTitle>
                <CardDescription className="text-sm">Adjust your retirement planning parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Calculation Mode</Label>
                  <Tabs
                    value={calculationMode}
                    onValueChange={(value) => setCalculationMode(value as "contribution" | "target")}
                  >
                    <TabsList className="grid w-full grid-cols-2 h-10">
                      <TabsTrigger value="contribution" className="text-xs">
                        Project Corpus
                      </TabsTrigger>
                      <TabsTrigger value="target" className="text-xs">
                        Find Contribution
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Current Age</Label>
                    <Input
                      type="number"
                      value={inputs.currentAge}
                      onChange={(e) => setInputs((prev) => ({ ...prev, currentAge: Number(e.target.value) }))}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Retirement Age</Label>
                    <Input
                      type="number"
                      value={inputs.retirementAge}
                      onChange={(e) => setInputs((prev) => ({ ...prev, retirementAge: Number(e.target.value) }))}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Current Corpus</Label>
                  <Input
                    type="number"
                    value={inputs.currentCorpus}
                    onChange={(e) => setInputs((prev) => ({ ...prev, currentCorpus: Number(e.target.value) }))}
                    className="h-10"
                    min={0}
                    step={1000}
                  />
                </div>
                {calculationMode === "contribution" ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Monthly Contribution</Label>
                    <Input
                      type="number"
                      value={inputs.monthlyContribution}
                      onChange={(e) => setInputs((prev) => ({ ...prev, monthlyContribution: Number(e.target.value) }))}
                      className="h-10"
                      min={0}
                      step={500}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Target Type</Label>
                      <Tabs value={targetType} onValueChange={(v) => setTargetType(v as "corpus" | "pension")}>
                        <TabsList className="grid grid-cols-2 w-full h-10">
                          <TabsTrigger value="corpus" className="text-xs">Target Corpus</TabsTrigger>
                          <TabsTrigger value="pension" className="text-xs">Target Pension</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {targetType === "corpus" ? (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Target Corpus</Label>
                        <Input
                          type="number"
                          value={inputs.targetCorpus}
                          onChange={(e) => setInputs((prev) => ({ ...prev, targetCorpus: Number(e.target.value) }))}
                          className="h-10"
                          min={0}
                          step={50000}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Target Pension (per month)</Label>
                          <Input
                            type="number"
                            value={inputs.targetMonthlyPension}
                            onChange={(e) => setInputs((prev) => ({ ...prev, targetMonthlyPension: Number(e.target.value) }))}
                            className="h-10"
                            min={0}
                            step={500}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">
                            Annuity Share: <span className="font-semibold text-primary">{inputs.annuityShare}%</span>
                          </Label>
                          <Slider
                            value={[inputs.annuityShare]}
                            onValueChange={([value]) => setInputs((prev) => ({ ...prev, annuityShare: value }))}
                            min={40}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">
                            Annuity Rate: <span className="font-semibold text-primary">{inputs.annuityRate}%</span>
                          </Label>
                          <Slider
                            value={[inputs.annuityRate]}
                            onValueChange={([value]) => setInputs((prev) => ({ ...prev, annuityRate: value }))}
                            min={4}
                            max={9}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Expected Return: <span className="font-semibold text-primary">{inputs.expectedReturn}%</span>
                  </Label>
                  <Slider
                    value={[inputs.expectedReturn]}
                    onValueChange={([value]) => setInputs((prev) => ({ ...prev, expectedReturn: value }))}
                    min={6}
                    max={18}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      Inflation-adjusted
                      <Switch checked={inflationAdjusted} onCheckedChange={setInflationAdjusted} />
                    </Label>
                    <span className="text-sm text-muted-foreground">{inputs.inflation}%</span>
                  </div>
                  <Slider
                    value={[inputs.inflation]}
                    onValueChange={([value]) => setInputs((prev) => ({ ...prev, inflation: value }))}
                    min={3}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Contribution Growth: {" "}
                    <span className="font-semibold text-primary">{inputs.contributionGrowth}%</span>
                  </Label>
                  <Slider
                    value={[inputs.contributionGrowth]}
                    onValueChange={([value]) => setInputs((prev) => ({ ...prev, contributionGrowth: value }))}
                    min={0}
                    max={15}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-chart-1/10 rounded-xl border border-chart-1/20">
                      <Target className="h-6 w-6 text-chart-1" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {calculationMode === "contribution" ? "Projected Corpus" : "Required Monthly"}
                      </p>
                      <p className="text-2xl font-bold tracking-tight">
                        {calculationMode === "contribution"
                          ? formatCurrency(projectedCorpus)
                          : formatCurrency(requiredContribution)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-chart-2/10 rounded-xl border border-chart-2/20">
                      <TrendingUp className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Corpus{inflationAdjusted ? " (inflation-adjusted)" : ""}</p>
                      <p className="text-2xl font-bold tracking-tight">
                        {formatCurrency(
                          inflationAdjusted
                            ? (projectionData[projectionData.length - 1]?.realValue || 0)
                            : (projectionData[projectionData.length - 1]?.corpus || 0)
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-chart-3/10 rounded-xl border border-chart-3/20">
                      <BarChart3 className="h-6 w-6 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Years to Retire</p>
                      <p className="text-2xl font-bold tracking-tight">{inputs.retirementAge - inputs.currentAge}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {calculationMode === "target" && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Retirement Goal Progress</CardTitle>
                  <CardDescription>How close you are to your target retirement corpus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Current Progress</span>
                      <Badge variant={progressPercentage >= 100 ? "default" : "secondary"} className="font-semibold">
                        {progressPercentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">₹0</span>
                      <span className="text-muted-foreground font-medium">
                        Target: {formatCurrency(
                          effectiveTargetCorpus(
                            targetType,
                            inputs.targetCorpus,
                            inputs.targetMonthlyPension,
                            inputs.annuityRate,
                            inputs.annuityShare
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Corpus Growth Projection</CardTitle>
                <CardDescription>Your retirement corpus growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="age" className="text-muted-foreground" fontSize={12} tickLine={false} />
                      <YAxis
                        tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                        className="text-muted-foreground"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), "Corpus"]}
                        labelFormatter={(age) => `Age: ${age}`}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "14px",
                        }}
                      />
                      <Legend />
                      {inflationAdjusted ? (
                        <Area
                          type="monotone"
                          dataKey="realValue"
                          stroke="#22c55e"
                          fill="rgba(34,197,94,0.2)"
                          name="Corpus"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Area
                          type="monotone"
                          dataKey="corpus"
                          stroke="#22c55e"
                          fill="rgba(34,197,94,0.2)"
                          name="Corpus"
                          strokeWidth={2.5}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
