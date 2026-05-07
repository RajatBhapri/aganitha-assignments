import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/db/queries";
import type { ChartFilters } from "@/lib/types";

export const runtime = "nodejs";

function parseNum(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;
    const filters: ChartFilters = {
      genre:      p.get("genre") ?? "All",
      minRating:  parseNum(p.get("minRating"),  3),
      startYear:  parseNum(p.get("startYear"),  1980),
      endYear:    parseNum(p.get("endYear"),    2025),
      limit:      parseNum(p.get("limit"),      10),
    };
    return NextResponse.json(getDashboardData(filters));
  } catch (error) {
    console.error("charts api error:", error);
    return NextResponse.json(
      { summary: { totalMovies: 0, totalRatings: 0, averageRating: 0 }, moviesByGenre: [], ratingTrend: [], topMovies: [] },
      { status: 500 }
    );
  }
}
