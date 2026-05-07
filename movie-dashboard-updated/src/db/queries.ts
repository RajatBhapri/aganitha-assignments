//   import { db } from "./client";
//   import type {
//     ChartFilters,
//     DashboardResponse,
//     ExplorerFilters,
//     ExplorerResponse,
//     GenreChartRow,
//     RatingTrendRow,
//     SummaryData,
//     TopMovieRow,
//   } from "@/lib/types";


//   export function getTableSchema(tableName: string) {
//   return db.prepare(`
//     SELECT column_name, display_label, data_type,
//            is_filterable, is_sortable, is_visible,
//            format_hint, display_order
//     FROM table_schema
//     WHERE table_name = ?
//     ORDER BY display_order
//   `).all(tableName) as Array<{
//     column_name: string;
//     display_label: string;
//     data_type: string;
//     is_filterable: number;
//     is_sortable: number;
//     is_visible: number;
//     format_hint: string | null;
//     display_order: number;
//   }>;
// }
//   // ─── Shared helpers ──────────────────────────────────────────────────────────

//   function splitGenres(value: string): string[] {
//     return value
//       .split("|")
//       .map((g) => g.trim())
//       .filter((g) => g && g !== "(no genres listed)");
//   }

//   function buildDashboardWhere(f: ChartFilters) {
//     const conditions = ["m.year IS NOT NULL", "m.year >= ?", "m.year <= ?", "r.rating >= ?"];
//     const params: Array<string | number> = [f.startYear, f.endYear, f.minRating];
//     if (f.genre !== "All") {
//       conditions.push("m.genres LIKE ?");
//       params.push(`%${f.genre}%`);
//     }
//     return { whereSql: conditions.join(" AND "), params };
//   }




// //   function buildDashboardWhere(f: ChartFilters) {
// //   const conditions = ["1=1"];
// //   const params: Array<string | number> = [];

// //   if (f.startYear) {
// //     conditions.push("m.year >= ?");
// //     params.push(f.startYear);
// //   }

// //   if (f.endYear) {
// //     conditions.push("m.year <= ?");
// //     params.push(f.endYear);
// //   }

// //   if (f.minRating > 0) {
// //     conditions.push("r.rating >= ?");
// //     params.push(f.minRating);
// //   }

// //   if (f.genre !== "All") {
// //     conditions.push("m.genres LIKE ?");
// //     params.push(`%${f.genre}%`);
// //   }

// //   return { whereSql: conditions.join(" AND "), params };
// // }

// // function buildDashboardWhere(f: ChartFilters) {
// //   return {
// //     whereSql: "1=1",
// //     params: [],
// //   };
// // }

//   // ─── Genres list ─────────────────────────────────────────────────────────────

//   export function getGenres(): string[] {
//     const rows = db.prepare("SELECT DISTINCT genres FROM movies").all() as Array<{ genres: string }>;
//     const set = new Set<string>();
//     for (const row of rows) {
//       for (const g of splitGenres(row.genres)) set.add(g);
//     }
//     return ["All", ...Array.from(set).sort()];
//   }

//   // ─── Dashboard data ───────────────────────────────────────────────────────────

//   export function getDashboardData(f: ChartFilters): DashboardResponse {
//     const { whereSql, params } = buildDashboardWhere(f);

//     const summary = db
//       .prepare(
//         `SELECT COUNT(DISTINCT m.id) as totalMovies,
//                 COUNT(r.id) as totalRatings,
//                 ROUND(AVG(r.rating), 2) as averageRating
//         FROM movies m JOIN ratings r ON r.movie_id = m.id WHERE ${whereSql}`
//       )
//       .get(...params) as SummaryData | undefined;

//     const ratingTrend = db
//       .prepare(
//         `SELECT m.year as year, ROUND(AVG(r.rating), 2) as avgRating
//         FROM movies m JOIN ratings r ON r.movie_id = m.id
//         WHERE ${whereSql} GROUP BY m.year ORDER BY m.year`
//       )
//       .all(...params) as RatingTrendRow[];

//     const rawRows = db
//       .prepare(
//         `SELECT DISTINCT m.id, m.genres FROM movies m JOIN ratings r ON r.movie_id = m.id WHERE ${whereSql}`
//       )
//       .all(...params) as Array<{ id: number; genres: string }>;

//     const genreMap = new Map<string, number>();
//     for (const row of rawRows) {
//       const unique = new Set(splitGenres(row.genres));
//       for (const g of unique) genreMap.set(g, (genreMap.get(g) ?? 0) + 1);
//     }

//     const moviesByGenre: GenreChartRow[] = Array.from(genreMap.entries())
//       .map(([genre, count]) => ({ genre, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 10);

//     // const topMovies = db
//     //   .prepare(
//     //     `SELECT m.title as title, ROUND(AVG(r.rating), 2) as avgRating, COUNT(r.id) as ratingCount
//     //     FROM movies m JOIN ratings r ON r.movie_id = m.id
//     //     WHERE ${whereSql} GROUP BY m.id, m.title HAVING COUNT(r.id) >= 20
//     //     ORDER BY avgRating DESC, ratingCount DESC LIMIT ?`
//     //   )
//     //   .all(...params, f.limit) as TopMovieRow[];

// const topMovies = db
//   .prepare(
//     `SELECT m.title as title,
//             ROUND(AVG(r.rating), 2) as avgRating,
//             COUNT(*) as ratingCount
//      FROM movies m
//      JOIN ratings r ON r.movie_id = m.id
//      WHERE ${whereSql}
//      GROUP BY m.id, m.title
//      HAVING COUNT(*) >= 5
//      ORDER BY avgRating DESC, ratingCount DESC
//      LIMIT ?`
//   )
//   .all(...params, f.limit) as TopMovieRow[];

//   //   const topMovies = db
//   // .prepare(
//   //   `SELECT m.title as title,
//   //           ROUND(AVG(r.rating), 2) as avgRating,
//   //           COUNT(*) as ratingCount
//   //    FROM movies m
//   //    JOIN ratings r ON r.movieId = m.id
//   //    WHERE ${whereSql}
//   //    GROUP BY m.id, m.title
//   //    HAVING COUNT(*) >= 20
//   //    ORDER BY avgRating DESC, ratingCount DESC
//   //    LIMIT ?`
//   // )
//   // .all(...params, f.limit) as TopMovieRow[];

//   // const topMovies = db
//   // .prepare(
//   //   `SELECT m.title as title,
//   //           ROUND(AVG(r.rating), 2) as avgRating,
//   //           COUNT(*) as ratingCount
//   //    FROM movies m
//   //    JOIN ratings r ON r.movieId = m.id
//   //    WHERE ${whereSql}
//   //    GROUP BY m.id, m.title
//   //    HAVING COUNT(*) >= 20
//   //    ORDER BY avgRating DESC, ratingCount DESC
//   //    LIMIT ?`
//   // )
//   // .all(...params, f.limit) as TopMovieRow[];

//   console.log(
//   db.prepare("SELECT COUNT(*) as count FROM ratings").get()
// );

// console.log(
//   db.prepare("SELECT COUNT(*) as count FROM movies WHERE year is NULL").get()
// );

// console.log(
//   db.prepare("SELECT MIN(year), MAX(year) FROM movies;").get()
// );


//     return {
//       summary: {
//         totalMovies: summary?.totalMovies ?? 0,
//         totalRatings: summary?.totalRatings ?? 0,
//         averageRating: summary?.averageRating ?? 0,
//       },
//       moviesByGenre,
//       ratingTrend,
//       topMovies,
//     };
//   }

//   // ─── Explorer data ────────────────────────────────────────────────────────────

//   // const VALID_SORT_COLS: Record<string, string> = {
//   //   title: "m.title",
//   //   year: "m.year",
//   //   avgRating: "avgRating",
//   //   ratingCount: "ratingCount",
//   // };

//   // export function getExplorerData(f: ExplorerFilters): ExplorerResponse {
//   //   const conditions: string[] = [];
//   //   const params: Array<string | number> = [];

//   //   if (f.search.trim()) {
//   //     conditions.push("m.title LIKE ?");
//   //     params.push(`%${f.search.trim()}%`);
//   //   }
//   //   if (f.genre !== "All") {
//   //     conditions.push("m.genres LIKE ?");
//   //     params.push(`%${f.genre}%`);
//   //   }
//   //   if (f.startYear) { conditions.push("m.year >= ?"); params.push(f.startYear); }
//   //   if (f.endYear)   { conditions.push("m.year <= ?"); params.push(f.endYear); }

//   //   const ratingFilter = f.minRating > 0 || f.maxRating < 5;
//   //   const havingClauses: string[] = [];
//   //   if (f.minRating > 0) havingClauses.push(`avgRating >= ${f.minRating}`);
//   //   if (f.maxRating < 5) havingClauses.push(`avgRating <= ${f.maxRating}`);

//   //   const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
//   //   const havingSql = havingClauses.length ? `HAVING ${havingClauses.join(" AND ")}` : "";

//   //   const orderCol = VALID_SORT_COLS[f.sortBy] ?? "ratingCount";
//   //   const orderDir = f.sortDir === "asc" ? "ASC" : "DESC";
//   //   const nullsLast = orderDir === "DESC" ? "NULLS LAST" : "NULLS FIRST";

//   //   const baseQuery = `
//   //     SELECT m.id, m.title, m.year, m.genres,
//   //           ROUND(AVG(r.rating), 2) as avgRating,
//   //           COUNT(r.id) as ratingCount
//   //     FROM movies m
//   //     LEFT JOIN ratings r ON r.movie_id = m.id
//   //     ${whereSql}
//   //     GROUP BY m.id, m.title, m.year, m.genres
//   //     ${havingSql}
//   //   `;

//   //   const countRow = db
//   //     .prepare(`SELECT COUNT(*) as total FROM (${baseQuery})`)
//   //     .get(...params) as { total: number };

//   //   const total = countRow.total;
//   //   const pageSize = Math.max(1, Math.min(f.pageSize, 200));
//   //   const page = Math.max(1, f.page);
//   //   const offset = (page - 1) * pageSize;
//   //   const totalPages = Math.ceil(total / pageSize);

//   //   const movies = db
//   //     .prepare(`${baseQuery} ORDER BY ${orderCol} ${orderDir} ${nullsLast} LIMIT ? OFFSET ?`)
//   //     .all(...params, pageSize, offset) as Array<{
//   //       id: number;
//   //       title: string;
//   //       year: number | null;
//   //       genres: string;
//   //       avgRating: number | null;
//   //       ratingCount: number;
//   //     }>;

//   //   return { movies, total, page, pageSize, totalPages };
//   // }


//   export function getExplorerData(f: ExplorerFilters): ExplorerResponse {
//   // 1. Get datasetId (latest dataset)
//   const dataset = db
//     .prepare(`SELECT datasetId FROM dataset_metadata ORDER BY datasetId DESC LIMIT 1`)
//     .get() as { datasetId: number };

//   const datasetId = dataset.datasetId;

//   // 2. Get visible columns for movies table
//   const columns = db
//     .prepare(`
//       SELECT column_name, display_label
//       FROM table_schema
//       WHERE datasetId = ? AND table_name = 'movies' AND is_visible = 1
//       ORDER BY display_order
//     `)
//     .all(datasetId) as Array<{ column_name: string; display_label: string }>;

//   // 3. Build SELECT dynamically
//   const selectCols = columns.map((c) => `m.${c.column_name}`).join(", ");

//   // Add computed columns (keep these fixed)
//   const computedCols = `
//     ROUND(AVG(r.rating), 2) as avgRating,
//     COUNT(r.ratingId) as ratingCount
//   `;

//   const conditions: string[] = [];
//   const params: Array<string | number> = [];

//   if (f.search.trim()) {
//     conditions.push("m.title LIKE ?");
//     params.push(`%${f.search.trim()}%`);
//   }

//   if (f.genre !== "All") {
//     conditions.push("m.genres LIKE ?");
//     params.push(`%${f.genre}%`);
//   }

//   if (f.startYear) {
//     conditions.push("m.year >= ?");
//     params.push(f.startYear);
//   }

//   if (f.endYear) {
//     conditions.push("m.year <= ?");
//     params.push(f.endYear);
//   }

//   const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

//   const baseQuery = `
//     SELECT ${selectCols}, ${computedCols}
//     FROM movies m
//     LEFT JOIN ratings r ON r.movieId = m.movieId
//     ${whereSql}
//     GROUP BY ${columns.map((c) => `m.${c.column_name}`).join(", ")}
//   `;

//   // 4. Count
//   const total = (
//     db.prepare(`SELECT COUNT(*) as total FROM (${baseQuery})`).get(...params) as {
//       total: number;
//     }
//   ).total;

//   const pageSize = Math.max(1, Math.min(f.pageSize, 200));
//   const page = Math.max(1, f.page);
//   const offset = (page - 1) * pageSize;
//   const totalPages = Math.ceil(total / pageSize);

//   // 5. Sorting (dynamic)
//   const sortCol =
//     columns.find((c) => c.column_name === f.sortBy)?.column_name ||
//     "ratingCount";

//   const orderDir = f.sortDir === "asc" ? "ASC" : "DESC";

//   const rows = db
//     .prepare(
//       `${baseQuery}
//        ORDER BY ${sortCol} ${orderDir}
//        LIMIT ? OFFSET ?`
//     )
//     .all(...params, pageSize, offset);

//   return {
//     movies: rows,
//     total,
//     page,
//     pageSize,
//     totalPages,
//     columns, // send metadata to frontend
//   };
// }


import { db } from "./client";
import type {
  ExplorerFilters,
  ExplorerResponse,
  ExplorerColumn,
  ExplorerMovie,
  ChartFilters,
  DashboardResponse,
  GenreChartRow,
  RatingTrendRow,
  TopMovieRow,
  SummaryData,
} from "@/lib/types";

/* ─────────────────────────────────────────────
   EXPLORER (DYNAMIC)
───────────────────────────────────────────── */

export function getExplorerData(f: ExplorerFilters): ExplorerResponse {
  const schema = db
    .prepare(`SELECT * FROM explorer_schema ORDER BY display_order`)
    .all() as ExplorerColumn[];

  const conditions: string[] = [];
  const params: any[] = [];

  // Dynamic filters
  for (const col of schema) {
    if (!col.is_filterable) continue;

    const value = f[col.column_name];
    if (value === undefined || value === "" || value === "All") continue;

    if (col.data_type === "string") {
      conditions.push(`${col.column_name} LIKE ?`);
      params.push(`%${value}%`);
    }

    if (col.data_type === "number" && Array.isArray(value)) {
      conditions.push(`${col.column_name} BETWEEN ? AND ?`);
      params.push(value[0], value[1]);
    }
  }

  const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const sortCol = f.sortBy || "id";
  const sortDir = f.sortDir === "asc" ? "ASC" : "DESC";

  const pageSize = Math.max(1, Math.min(f.pageSize || 20, 200));
  const page = Math.max(1, f.page || 1);
  const offset = (page - 1) * pageSize;

  const total = (
    db.prepare(`SELECT COUNT(*) as count FROM movies ${whereSql}`)
      .get(...params) as { count: number }
  ).count;

  const totalPages = Math.ceil(total / pageSize);

  const movies = db
    .prepare(`
      SELECT *
      FROM movies
      ${whereSql}
      ORDER BY ${sortCol} ${sortDir}
      LIMIT ? OFFSET ?
    `)
    .all(...params, pageSize, offset) as ExplorerMovie[];

  return {
    movies,
    total,
    page,
    pageSize,
    totalPages,
    schema, // ✅ IMPORTANT (NOT columns)
  };
}

/* ─────────────────────────────────────────────
   DASHBOARD (RESTORED — FIXES YOUR ERROR)
───────────────────────────────────────────── */

function splitGenres(value: string): string[] {
  return value
    .split("|")
    .map((g) => g.trim())
    .filter((g) => g && g !== "(no genres listed)");
}

function buildWhere(f: ChartFilters) {
  const conditions = ["m.year >= ?", "m.year <= ?", "r.rating >= ?"];
  const params: (string | number)[] = [
    f.startYear,
    f.endYear,
    f.minRating,
  ];

  if (f.genre !== "All") {
    conditions.push("m.genres LIKE ?");
    params.push(`%${f.genre}%`);
  }

  return { whereSql: conditions.join(" AND "), params };
}

export function getDashboardData(f: ChartFilters): DashboardResponse {
  const { whereSql, params } = buildWhere(f);

  const summary = db
    .prepare(`
      SELECT COUNT(DISTINCT m.id) as totalMovies,
             COUNT(r.id) as totalRatings,
             ROUND(AVG(r.rating), 2) as averageRating
      FROM movies m
      JOIN ratings r ON r.movie_id = m.id
      WHERE ${whereSql}
    `)
    .get(...params) as SummaryData;

  const ratingTrend = db
    .prepare(`
      SELECT m.year as year,
             ROUND(AVG(r.rating), 2) as avgRating
      FROM movies m
      JOIN ratings r ON r.movie_id = m.id
      WHERE ${whereSql}
      GROUP BY m.year
      ORDER BY m.year
    `)
    .all(...params) as RatingTrendRow[];

  const raw = db
    .prepare(`
      SELECT DISTINCT m.id, m.genres
      FROM movies m
      JOIN ratings r ON r.movie_id = m.id
      WHERE ${whereSql}
    `)
    .all(...params) as { id: number; genres: string }[];

  const genreMap = new Map<string, number>();

  for (const row of raw) {
    const unique = new Set(splitGenres(row.genres));
    for (const g of unique) {
      genreMap.set(g, (genreMap.get(g) ?? 0) + 1);
    }
  }

  const moviesByGenre: GenreChartRow[] = Array.from(genreMap.entries())
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topMovies = db
    .prepare(`
      SELECT m.title as title,
             ROUND(AVG(r.rating), 2) as avgRating,
             COUNT(*) as ratingCount
      FROM movies m
      JOIN ratings r ON r.movie_id = m.id
      WHERE ${whereSql}
      GROUP BY m.id
      HAVING COUNT(*) >= 5
      ORDER BY avgRating DESC
      LIMIT ?
    `)
    .all(...params, f.limit) as TopMovieRow[];

  return {
    summary,
    ratingTrend,
    moviesByGenre,
    topMovies,
  };
}