export type ChartFilters = {
  genre: string;
  minRating: number;
  startYear: number;
  endYear: number;
  limit: number;
};

export type SummaryData = {
  totalMovies: number;
  totalRatings: number;
  averageRating: number;
};

export type GenreChartRow = {
  genre: string;
  count: number;
};

export type RatingTrendRow = {
  year: number;
  avgRating: number;
};

export type TopMovieRow = {
  title: string;
  avgRating: number;
  ratingCount: number;
};

export type DashboardResponse = {
  summary: SummaryData;
  moviesByGenre: GenreChartRow[];
  ratingTrend: RatingTrendRow[];
  topMovies: TopMovieRow[];
};

// export type ExplorerFilters = {
//   search: string;
//   genre: string;
//   minRating: number;
//   maxRating: number;
//   startYear: number;
//   endYear: number;
//   sortBy: "title" | "year" | "avgRating" | "ratingCount";
//   sortDir: "asc" | "desc";
//   page: number;
//   pageSize: number;
// };

// export type ExplorerMovie = {
//   id: number;
//   title: string;
//   year: number | null;
//   genres: string;
//   avgRating: number | null;
//   ratingCount: number;
// };

// export type ExplorerResponse = {
//   movies: ExplorerMovie[];
//   total: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
// };

// export type ExplorerColumn = {
//   column_name: string;
//   display_label: string;
//   data_type: "string" | "number";
//   is_filterable: number;
//   is_sortable: number;
//   is_visible: number;
//   format_hint: string | null;
//   display_order: number;
// };

// export type ExplorerMovie = Record<string, any>;

// export type ExplorerFilters = {
//   [key: string]: any;
//   sortBy: string;
//   sortDir: "asc" | "desc";
//   page: number;
//   pageSize: number;
// };

// export type ExplorerResponse = {
//   movies: ExplorerMovie[];
//   total: number;
//   page: number;
//   pageSize: number;
//   totalPages: number;
//   columns: ExplorerColumn[];
// };

// ─── Explorer Types (FINAL) ─────────────────────────

export type ExplorerColumn = {
  column_name: string;
  display_label: string;
  data_type: "string" | "number";
  is_filterable: number;
  is_sortable: number;
  is_visible: number;
  format_hint: string | null;
  display_order: number;
};

// dynamic row
export type ExplorerMovie = Record<string, any>;

// dynamic filters
export type ExplorerFilters = {
  [key: string]: any;
  sortBy: string;
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
};

// ✅ IMPORTANT: MUST include schema
export type ExplorerResponse = {
  movies: ExplorerMovie[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  schema: ExplorerColumn[];
};

export const CHART_COLORS = [
  "#22d3ee",
  "#a855f7",
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#e879f9",
  "#84cc16",
  "#fb7185",
  "#38bdf8",
];

export const DEFAULT_FILTERS: ChartFilters = {
  genre: "All",
  minRating: 3,
  startYear: 1990,
  endYear: 2025,
  limit: 10,
};

export const DEFAULT_EXPLORER_FILTERS: ExplorerFilters = {
  search: "",
  genre: "All",
  minRating: 0,
  maxRating: 5,
  startYear: 1900,
  endYear: 2025,
  sortBy: "ratingCount",
  sortDir: "desc",
  page: 1,
  pageSize: 20,
};
