"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { Sun, Moon, ArrowLeft } from "lucide-react"
import { ReactNode } from "react"

interface CalculatorHeaderProps {
  title: string
  subtitle?: string
  Icon: React.ComponentType<{ className?: string }>
}

export function CalculatorHeader({ title, subtitle, Icon }: CalculatorHeaderProps) {
  const { theme, setTheme } = useTheme()
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl border">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
            {subtitle ? (
              <CardDescription className="text-muted-foreground">{subtitle}</CardDescription>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              All calculators
            </Link>
          </Button>
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
  )
}
