// import { NextRequest, NextResponse } from "next/server";
// import { getExplorerData } from "@/db/queries";
// import type { ExplorerFilters } from "@/lib/types";

// export const runtime = "nodejs";

// function parseNum(v: string | null, fallback: number) {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : fallback;
// }

// export function GET(request: NextRequest) {
//   try {
//     const p = request.nextUrl.searchParams;

//     const filters: ExplorerFilters = {
//       search: p.get("search") ?? "",
//       genre: p.get("genre") ?? "All",
//       minRating: parseNum(p.get("minRating"), 0),
//       maxRating: parseNum(p.get("maxRating"), 5),
//       startYear: parseNum(p.get("startYear"), 1900),
//       endYear: parseNum(p.get("endYear"), 2025),
//       sortBy: (p.get("sortBy") as ExplorerFilters["sortBy"]) ?? "ratingCount",
//       sortDir: (p.get("sortDir") as ExplorerFilters["sortDir"]) ?? "desc",
//       page: parseNum(p.get("page"), 1),
//       pageSize: parseNum(p.get("pageSize"), 20),
//     };

//     const format = p.get("format");

//     const result = getExplorerData(filters);

//     if (format === "csv") {
//       const header = "id,title,year,genres,avgRating,ratingCount";
//       const rows = result.movies.map((m) =>
//         [
//           m.id,
//           `"${m.title.replace(/"/g, '""')}"`,
//           m.year ?? "",
//           `"${m.genres.replace(/"/g, '""')}"`,
//           m.avgRating ?? "",
//           m.ratingCount,
//         ].join(",")
//       );
//       const csv = [header, ...rows].join("\n");
//       return new NextResponse(csv, {
//         headers: {
//           "Content-Type": "text/csv",
//           "Content-Disposition": 'attachment; filename="movies.csv"',
//         },
//       });
//     }

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("explorer api error:", error);
//     return NextResponse.json({ movies: [], total: 0, page: 1, pageSize: 20, totalPages: 0 }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { getExplorerData } from "@/db/queries";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  try {
    const p = request.nextUrl.searchParams;

    const filters: any = {};

    p.forEach((value, key) => {
      try {
        filters[key] = JSON.parse(value);
      } catch {
        filters[key] = value;
      }
    });

    const result = getExplorerData(filters);

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { movies: [], total: 0, page: 1, pageSize: 20, totalPages: 0, schema: [] },
      { status: 500 }
    );
  }
}