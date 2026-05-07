import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardClient } from "@/components/DashboardClient";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Movie Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Filter the dataset, click pie slices to drill down, explore ratings over time.
            </p>
          </div>
        </div>

        <DashboardClient />
      </div>
    </main>
  );
}
