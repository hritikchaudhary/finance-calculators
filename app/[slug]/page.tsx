import Link from "next/link"
import { redirect } from "next/navigation"
import { calculators } from "@/lib/calculators"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CalculatorPlaceholder({ params }: { params: { slug: string } }) {
  const slug = params.slug
  if (slug === "nps") redirect("/nps")

  const meta = calculators.find((c) => c.slug === slug)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{meta?.title || "Calculator"}</h1>
            <p className="text-muted-foreground">{meta?.description || "Calculator coming soon"}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">All Calculators</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Coming soon</CardTitle>
            <CardDescription>
              This calculator is not implemented yet. Check back shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Want this one next? Tell me which ones to prioritize.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
