import Link from "next/link";
import { Film, BarChart3, Database, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: BarChart3,
    title: "Interactive Charts",
    description: "Click genre slices to filter all charts in real time.",
  },
  {
    icon: Database,
    title: "Data Explorer",
    description: "Browse, search, sort and filter the full movie dataset.",
  },
  {
    icon: Zap,
    title: "Large Dataset Support",
    description: "Generate millions of rows using Node.js Streams + Faker.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-start justify-center gap-10 px-6 py-16">
        <div className="space-y-4">
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <Film className="h-3 w-3" />
            Next.js · SQLite · shadcn/ui · Recharts
          </Badge>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Movie Preference{" "}
            <span className="text-primary">Analytics</span> Dashboard
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            Explore real movie data with interactive charts, advanced filters, a full data
            explorer, and million-row dataset generation.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/explorer">Data Explorer</Link>
          </Button>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="bg-card">
              <CardContent className="pt-6">
                <f.icon className="mb-3 h-6 w-6 text-primary" />
                <p className="font-semibold text-foreground">{f.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
