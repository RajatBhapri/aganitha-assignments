"use client";

import { useEffect, useState, useCallback } from "react";
import { FilterPanel } from "./FilterPanel";
import { GenrePieChart } from "./GenrePieChart";
import { MoviesByGenreChart } from "./MoviesByGenreChart";
import { RatingTrendChart } from "./RatingTrendChart";
import { SummaryCards } from "./SummaryCards";
import { TopMoviesChart } from "./TopMoviesChart";
import { AskMeWidget } from "./AskMeWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import type { ChartFilters, DashboardResponse } from "@/lib/types";
import { DEFAULT_FILTERS } from "@/lib/types";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export function DashboardClient() {
  const [genres, setGenres] = useState<string[]>([]);
  const [filters, setFilters] = useState<ChartFilters>(DEFAULT_FILTERS);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJson<{ genres: string[] }>("/api/genres")
      .then((r) => setGenres(r.genres))
      .catch(() => setError("Could not load genres."));
  }, []);

  const loadData = useCallback((f: ChartFilters) => {
    const params = new URLSearchParams({
      genre: f.genre,
      minRating: String(f.minRating),
      startYear: String(f.startYear),
      endYear: String(f.endYear),
      limit: String(f.limit),
    });
    setLoading(true);
    setError("");
    fetchJson<DashboardResponse>(`/api/charts?${params}`)
      .then((r) => setData(r))
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData(filters);
  }, [filters, loadData]);

  if (loading && !data) {
    return (
      <Card>
        <CardContent className="flex h-48 items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading dashboard…
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex h-48 items-center justify-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          {error || "No data found."}
        </CardContent>
      </Card>
    );
  }

  // ONLY change the bottom part

return (
  <div className="space-y-6 w-full">
    {error && (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="flex items-center gap-2 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </CardContent>
      </Card>
    )}

    <FilterPanel genres={genres} filters={filters} onChange={setFilters} />

    {loading && (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Refreshing…
      </div>
    )}

    <SummaryCards summary={data.summary} />

    {/* ✅ GRID FIX */}
    <div className="grid gap-6 grid-cols-1 2xl:grid-cols-2">
  <div className="w-full min-w-0">
    <GenrePieChart
      data={data.moviesByGenre}
      activeGenre={filters.genre}
      onSelectGenre={(genre) =>
        setFilters((f) => ({ ...f, genre }))
      }
    />
  </div>

  <div className="w-full min-w-0">
    <MoviesByGenreChart data={data.moviesByGenre} />
  </div>
</div>

<div className="grid gap-6 grid-cols-1 2xl:grid-cols-2">
  <div className="w-full min-w-0">
    <RatingTrendChart data={data.ratingTrend} />
  </div>

  <div className="w-full min-w-0">
    <TopMoviesChart data={data.topMovies} />
  </div>
</div>

    {data && <AskMeWidget dashboardData={data} filters={filters} />}
  </div>
);
}