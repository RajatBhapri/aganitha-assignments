import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExplorerClient } from "@/components/ExplorerClient";

export default function ExplorerPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">Data Explorer</h1>
            <p className="text-sm text-muted-foreground">
              Browse, search, sort and filter every movie in the dataset.
            </p>
          </div>
        </div>
        <ExplorerClient />
      </div>
    </main>
  );
}
