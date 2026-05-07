// "use client";

// import { useEffect, useState, useCallback, useTransition } from "react";
// import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, RotateCcw, Loader2, Download } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Slider } from "@/components/ui/slider";
// import type { ExplorerFilters, ExplorerResponse, ExplorerMovie } from "@/lib/types";
// import { DEFAULT_EXPLORER_FILTERS } from "@/lib/types";
// import { formatNumber } from "@/lib/utils";

// const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
// const SORT_COLS: { key: ExplorerFilters["sortBy"]; label: string }[] = [
//   { key: "title", label: "Title" },
//   { key: "year", label: "Year" },
//   { key: "avgRating", label: "Avg Rating" },
//   { key: "ratingCount", label: "# Ratings" },
// ];

// type SortHeaderProps = {
//   col: ExplorerFilters["sortBy"];
//   label: string;
//   current: ExplorerFilters["sortBy"];
//   dir: ExplorerFilters["sortDir"];
//   onClick: (col: ExplorerFilters["sortBy"]) => void;
// };

// function SortHeader({ col, label, current, dir, onClick }: SortHeaderProps) {
//   const active = current === col;
//   return (
//     <button
//       onClick={() => onClick(col)}
//       className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
//     >
//       {label}
//       {active ? (
//         dir === "asc" ? <ChevronUp className="h-3.5 w-3.5 text-primary" /> : <ChevronDown className="h-3.5 w-3.5 text-primary" />
//       ) : (
//         <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
//       )}
//     </button>
//   );
// }

// function GenreBadges({ genres }: { genres: string }) {
//   const list = genres.split("|").filter((g) => g && g !== "(no genres listed)");
//   return (
//     <div className="flex flex-wrap gap-1">
//       {list.map((g) => (
//         <Badge key={g} variant="secondary" className="text-[10px] px-1.5 py-0">
//           {g}
//         </Badge>
//       ))}
//     </div>
//   );
// }

// async function fetchExplorer(f: ExplorerFilters): Promise<ExplorerResponse> {
//   const params = new URLSearchParams({
//     search: f.search,
//     genre: f.genre,
//     minRating: String(f.minRating),
//     maxRating: String(f.maxRating),
//     startYear: String(f.startYear),
//     endYear: String(f.endYear),
//     sortBy: f.sortBy,
//     sortDir: f.sortDir,
//     page: String(f.page),
//     pageSize: String(f.pageSize),
//   });
//   const res = await fetch(`/api/explorer?${params}`);
//   if (!res.ok) throw new Error("Failed");
//   return res.json() as Promise<ExplorerResponse>;
// }

// export function ExplorerClient() {
//   const [genres, setGenres] = useState<string[]>([]);
//   const [filters, setFilters] = useState<ExplorerFilters>(DEFAULT_EXPLORER_FILTERS);
//   const [data, setData] = useState<ExplorerResponse | null>(null);
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch("/api/genres")
//       .then((r) => r.json() as Promise<{ genres: string[] }>)
//       .then((r) => setGenres(r.genres))
//       .catch(() => {});
//   }, []);

//   const load = useCallback((f: ExplorerFilters) => {
//     startTransition(() => {
//       fetchExplorer(f)
//         .then((d) => { setData(d); setError(""); })
//         .catch(() => setError("Failed to load data."));
//     });
//   }, []);

//   useEffect(() => { load(filters); }, [filters, load]);

//   function setFilter<K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) {
//     setFilters((f) => ({ ...f, [key]: value, page: key !== "page" ? 1 : (value as number) }));
//   }

//   function toggleSort(col: ExplorerFilters["sortBy"]) {
//     setFilters((f) => ({
//       ...f,
//       sortBy: col,
//       sortDir: f.sortBy === col ? (f.sortDir === "asc" ? "desc" : "asc") : "desc",
//       page: 1,
//     }));
//   }

//   function exportCsv() {
//     const params = new URLSearchParams({
//       search: filters.search,
//       genre: filters.genre,
//       minRating: String(filters.minRating),
//       maxRating: String(filters.maxRating),
//       startYear: String(filters.startYear),
//       endYear: String(filters.endYear),
//       sortBy: filters.sortBy,
//       sortDir: filters.sortDir,
//       page: "1",
//       pageSize: "10000",
//       format: "csv",
//     });
//     window.open(`/api/explorer?${params}`, "_blank");
//   }

//   const totalPages = data?.totalPages ?? 1;
//   const currentPage = filters.page;

//   return (
//     <div className="space-y-4">
//       {/* Filter card */}
//       <Card>
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="text-base">Filters</CardTitle>
//               <CardDescription>Search and filter the full dataset.</CardDescription>
//             </div>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1.5">
//                 <Download className="h-3.5 w-3.5" />
//                 Export CSV
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="gap-1.5 text-muted-foreground"
//                 onClick={() => setFilters(DEFAULT_EXPLORER_FILTERS)}
//               >
//                 <RotateCcw className="h-3.5 w-3.5" />
//                 Reset
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             {/* Search */}
//             <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
//               <Label>Search</Label>
//               <div className="relative">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Movie title…"
//                   value={filters.search}
//                   onChange={(e) => setFilter("search", e.target.value)}
//                   className="pl-8"
//                 />
//               </div>
//             </div>

//             {/* Genre */}
//             <div className="space-y-1.5">
//               <Label>Genre</Label>
//               <Select value={filters.genre} onValueChange={(v) => setFilter("genre", v)}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   {genres.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Year Range */}
//             <div className="space-y-1.5">
//               <Label>
//                 Year Range:{" "}
//                 <span className="text-primary">{filters.startYear} – {filters.endYear}</span>
//               </Label>
//               <Slider
//                 min={1900}
//                 max={2025}
//                 step={1}
//                 value={[filters.startYear, filters.endYear]}
//                 onValueChange={([s, e]) => setFilters((f) => ({ ...f, startYear: s, endYear: e, page: 1 }))}
//                 className="mt-3"
//               />
//             </div>

//             {/* Rating Range */}
//             <div className="space-y-1.5">
//               <Label>
//                 Rating Range:{" "}
//                 <span className="text-primary">{filters.minRating.toFixed(1)} – {filters.maxRating.toFixed(1)}</span>
//               </Label>
//               <Slider
//                 min={0}
//                 max={5}
//                 step={0.5}
//                 value={[filters.minRating, filters.maxRating]}
//                 onValueChange={([min, max]) => setFilters((f) => ({ ...f, minRating: min, maxRating: max, page: 1 }))}
//                 className="mt-3"
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Table card */}
//       <Card>
//         <CardHeader className="pb-2">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <CardTitle className="text-base">Movies</CardTitle>
//               {data && (
//                 <Badge variant="secondary">{formatNumber(data.total)} results</Badge>
//               )}
//               {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
//             </div>
//             <Select
//               value={String(filters.pageSize)}
//               onValueChange={(v) => setFilter("pageSize", Number(v))}
//             >
//               <SelectTrigger className="h-8 w-28 text-xs">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {PAGE_SIZE_OPTIONS.map((n) => (
//                   <SelectItem key={n} value={String(n)}>{n} / page</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardHeader>
//         <CardContent className="p-0">
//           {error ? (
//             <p className="p-6 text-sm text-destructive">{error}</p>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b bg-muted/50">
//                       <th className="px-4 py-3 text-left">
//                         <SortHeader col="title" label="Title" current={filters.sortBy} dir={filters.sortDir} onClick={toggleSort} />
//                       </th>
//                       <th className="px-4 py-3 text-left">
//                         <SortHeader col="year" label="Year" current={filters.sortBy} dir={filters.sortDir} onClick={toggleSort} />
//                       </th>
//                       <th className="px-4 py-3 text-left">Genres</th>
//                       <th className="px-4 py-3 text-right">
//                         <SortHeader col="avgRating" label="Avg Rating" current={filters.sortBy} dir={filters.sortDir} onClick={toggleSort} />
//                       </th>
//                       <th className="px-4 py-3 text-right">
//                         <SortHeader col="ratingCount" label="# Ratings" current={filters.sortBy} dir={filters.sortDir} onClick={toggleSort} />
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data?.movies.length === 0 ? (
//                       <tr>
//                         <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
//                           No movies match your filters.
//                         </td>
//                       </tr>
//                     ) : (
//                       data?.movies.map((movie: ExplorerMovie) => (
//                         <tr key={movie.id} className="border-b transition-colors hover:bg-muted/30">
//                           <td className="px-4 py-3 font-medium max-w-xs truncate" title={movie.title}>
//                             {movie.title}
//                           </td>
//                           <td className="px-4 py-3 text-muted-foreground">
//                             {movie.year ?? "—"}
//                           </td>
//                           <td className="px-4 py-3">
//                             <GenreBadges genres={movie.genres} />
//                           </td>
//                           <td className="px-4 py-3 text-right">
//                             {movie.avgRating != null ? (
//                               <span className="font-medium text-amber-400">
//                                 ★ {movie.avgRating.toFixed(2)}
//                               </span>
//                             ) : (
//                               <span className="text-muted-foreground">—</span>
//                             )}
//                           </td>
//                           <td className="px-4 py-3 text-right text-muted-foreground">
//                             {formatNumber(movie.ratingCount)}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               <div className="flex items-center justify-between border-t px-4 py-3">
//                 <p className="text-xs text-muted-foreground">
//                   {data
//                     ? `Page ${currentPage} of ${totalPages} · ${formatNumber(data.total)} total`
//                     : "Loading…"}
//                 </p>
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     className="h-7 w-7"
//                     disabled={currentPage <= 1}
//                     onClick={() => setFilter("page", currentPage - 1)}
//                   >
//                     <ChevronLeft className="h-3.5 w-3.5" />
//                   </Button>
//                   {/* Page number chips */}
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     const p = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
//                     return (
//                       <Button
//                         key={p}
//                         variant={p === currentPage ? "default" : "outline"}
//                         size="icon"
//                         className="h-7 w-7 text-xs"
//                         onClick={() => setFilter("page", p)}
//                       >
//                         {p}
//                       </Button>
//                     );
//                   })}
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     className="h-7 w-7"
//                     disabled={currentPage >= totalPages}
//                     onClick={() => setFilter("page", currentPage + 1)}
//                   >
//                     <ChevronRight className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { ExplorerResponse, ExplorerColumn } from "@/lib/types";

export function ExplorerClient() {
  const [data, setData] = useState<ExplorerResponse | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isPending, startTransition] = useTransition();

  function fetchData(f: Record<string, any>) {
    startTransition(() => {
      const params = new URLSearchParams();

      Object.entries(f).forEach(([k, v]) => {
        params.set(k, JSON.stringify(v));
      });

      fetch(`/api/explorer?${params}`)
        .then((r) => r.json())
        .then((res: ExplorerResponse) => setData(res));
    });
  }

  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  function updateFilter(key: string, value: any) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  }

  const schema: ExplorerColumn[] = data?.schema ?? [];

  const visibleCols: ExplorerColumn[] = schema
    .filter((c: ExplorerColumn) => c.is_visible === 1)
    .sort(
      (a: ExplorerColumn, b: ExplorerColumn) =>
        a.display_order - b.display_order
    );

  const filterableCols: ExplorerColumn[] = schema.filter(
    (c: ExplorerColumn) => c.is_filterable === 1
  );

  return (
    <div className="space-y-4">
      {/* FILTERS */}
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {filterableCols.map((col: ExplorerColumn) => (
            <div key={col.column_name}>
              <label className="text-sm">{col.display_label}</label>

              {col.data_type === "string" ? (
                <Input
                  onChange={(e) =>
                    updateFilter(col.column_name, e.target.value)
                  }
                />
              ) : (
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  onValueChange={(v: number[]) =>
                    updateFilter(col.column_name, v)
                  }
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Movies</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr>
                {visibleCols.map((col: ExplorerColumn) => (
                  <th key={col.column_name}>{col.display_label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data?.movies.map((row: Record<string, any>, i: number) => (
                <tr key={i}>
                  {visibleCols.map((col: ExplorerColumn) => (
                    <td key={col.column_name}>
                      {row[col.column_name] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {isPending && <p>Loading...</p>}
        </CardContent>
      </Card>
    </div>
  );
}