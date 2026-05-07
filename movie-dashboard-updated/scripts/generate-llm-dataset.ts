/**
 * generate-dataset.ts
 * ──────────────────────────────────────────────────────────────────
 * Streams millions of synthetic movie/rating/user rows directly into
 * SQLite. Also writes three metadata tables so your frontend never
 * needs to hardcode schema, column names, or data types.
 *
 * INSTALL:
 *   npm install better-sqlite3
 *   npm install --save-dev @types/better-sqlite3 ts-node typescript
 *
 * RUN:
 *   npx ts-node generate-dataset.ts
 *
 * ENV OVERRIDES:
 *   MOVIE_COUNT=500000 RATINGS_PER_MOVIE=20 USER_COUNT=100000 npx ts-node generate-dataset.ts
 * ──────────────────────────────────────────────────────────────────
 */

import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ─── Config ───────────────────────────────────────────────────────
const MOVIE_COUNT       = Number(process.env.MOVIE_COUNT        ?? 1_000_000);
const RATINGS_PER_MOVIE = Number(process.env.RATINGS_PER_MOVIE  ?? 10);
const USER_COUNT        = Number(process.env.USER_COUNT         ?? 50_000);
const BATCH_SIZE        = 2_000; // rows committed per transaction
const DB_PATH           = process.env.DB_PATH ?? "movie_dashboard.db";

// ─── Static data pools ───────────────────────────────────────────
const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Fantasy", "Horror", "Mystery",
  "Romance", "Sci-Fi", "Thriller", "Western", "Musical",
];

const TITLE_PREFIXES = [
  "The", "A", "Beyond", "Into", "Under", "Dark", "Last",
  "Lost", "Broken", "Rising", "Fallen", "Silent", "Burning",
  "Frozen", "Hidden", "Secret", "Ancient", "Final", "Distant",
];

const TITLE_NOUNS = [
  "Dawn", "Shadow", "Echo", "Storm", "River", "Mountain", "Sky",
  "City", "Kingdom", "Empire", "Mind", "Heart", "Soul", "Dream",
  "Night", "Light", "Fire", "Ice", "Star", "Moon", "Wind", "Ocean",
  "Desert", "Island", "Bridge", "Tower", "Mirror", "Clock", "Road",
];

const TITLE_SUFFIXES = [
  "", "", "", "",                  // no suffix most of the time
  ": The Reckoning", "Returns", "Reborn", "Rising", "Begins",
  "2", "3", "II", "III", "Chronicles", "Legacy", "Origins",
];

const FIRST_NAMES = [
  "Alice", "Bob", "Carlos", "Diana", "Elena", "Frank", "Grace",
  "Henry", "Iris", "Jake", "Karen", "Liam", "Maya", "Noah",
  "Olivia", "Paul", "Quinn", "Rachel", "Sam", "Tara", "Uma",
  "Victor", "Wendy", "Xena", "Yusuf", "Zoe",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia",
  "Miller", "Davis", "Martinez", "Wilson", "Anderson", "Taylor",
  "Thomas", "Hernandez", "Moore", "Martin", "Lee", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Lewis", "Robinson",
];

const COUNTRIES = [
  "US", "IN", "UK", "DE", "FR", "JP", "BR", "CA", "AU", "MX",
  "KR", "IT", "ES", "NL", "SE", "NO", "PL", "TR", "ZA", "AR",
];

// Rating values biased toward middle-high (3–4.5 range)
const RATINGS_POOL    = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
const RATINGS_WEIGHTS = [  1,   2,   3,   5,   8,  12,  15,  18,  14,  10];
const RATINGS_CDF     = buildCdf(RATINGS_WEIGHTS);

// ─── Helpers ─────────────────────────────────────────────────────
function buildCdf(weights: number[]): number[] {
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  return weights.map((w) => (acc += w / total));
}

function weightedRandom(): number {
  const r = Math.random();
  for (let i = 0; i < RATINGS_CDF.length; i++) {
    if (r <= RATINGS_CDF[i]) return RATINGS_POOL[i];
  }
  return RATINGS_POOL[RATINGS_POOL.length - 1];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function randomYear(): number {
  return 1970 + Math.floor(Math.random() * 55); // 1970-2024
}

function randomTimestamp(): number {
  const start = new Date("2000-01-01").getTime();
  const end   = new Date("2024-12-31").getTime();
  return Math.floor((start + Math.random() * (end - start)) / 1000);
}

function makeTitle(): string {
  return `${pick(TITLE_PREFIXES)} ${pick(TITLE_NOUNS)}${pick(TITLE_SUFFIXES)}`;
}

function makeEmail(firstName: string, lastName: string, id: number): string {
  const providers = ["gmail.com", "yahoo.com", "outlook.com", "mail.com"];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@${pick(providers)}`;
}

function progress(label: string, done: number, total: number): void {
  const pct = Math.floor((done / total) * 100);
  const bar = "█".repeat(Math.floor(pct / 5)) + "░".repeat(20 - Math.floor(pct / 5));
  process.stdout.write(`\r  ${label}  [${bar}]  ${pct}%  (${done.toLocaleString()} / ${total.toLocaleString()})`);
}

// ─── 1. DATABASE + SCHEMA SETUP ──────────────────────────────────
function setupDatabase(): Database.Database {
  const db = new Database(DB_PATH);

  // Performance PRAGMAs — essential for bulk inserts
  db.pragma("journal_mode = WAL");       // Write-Ahead Log: faster, safer
  db.pragma("synchronous = NORMAL");     // Reduce disk flushes without data loss risk
  db.pragma("cache_size = -65536");      // 64 MB page cache
  db.pragma("temp_store = MEMORY");      // Temp tables in RAM
  db.pragma("mmap_size = 268435456");    // 256 MB memory-mapped I/O

  db.exec(`
    -- ── Data tables ───────────────────────────────────────────────

    CREATE TABLE IF NOT EXISTS movies (
      movieId   INTEGER PRIMARY KEY,
      title     TEXT    NOT NULL,
      genres    TEXT    NOT NULL,          -- pipe-separated e.g. "Action|Drama"
      year      INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      userId     INTEGER PRIMARY KEY,
      name       TEXT    NOT NULL,
      email      TEXT    NOT NULL UNIQUE,
      country    TEXT    NOT NULL,
      age        INTEGER NOT NULL,
      created_at INTEGER NOT NULL          -- unix timestamp
    );

    CREATE TABLE IF NOT EXISTS ratings (
      ratingId  INTEGER PRIMARY KEY AUTOINCREMENT,
      userId    INTEGER NOT NULL,
      movieId   INTEGER NOT NULL,
      rating    REAL    NOT NULL,
      timestamp INTEGER NOT NULL,          -- unix timestamp
      FOREIGN KEY (userId)  REFERENCES users(userId),
      FOREIGN KEY (movieId) REFERENCES movies(movieId)
    );

    -- ── Metadata tables ───────────────────────────────────────────
    --
    -- PURPOSE: Your frontend reads these tables at startup and
    -- builds the UI dynamically. No hardcoded columns, no hardcoded
    -- schemas. Add a new column to movies? Add a row here and
    -- the table page picks it up automatically.

    -- One row per dataset in this DB (supports multiple datasets)
    CREATE TABLE IF NOT EXISTS dataset_metadata (
      datasetId         INTEGER PRIMARY KEY AUTOINCREMENT,
      name              TEXT    NOT NULL UNIQUE,
      description       TEXT,
      version           TEXT    NOT NULL DEFAULT '1.0.0',
      created_at        TEXT    NOT NULL,
      total_movies      INTEGER,
      total_ratings     INTEGER,
      total_users       INTEGER,
      ratings_per_movie INTEGER,
      generator_config  TEXT                -- JSON: full env config used
    );

    -- One row per column per table — drives table headers, filters, sort
    CREATE TABLE IF NOT EXISTS table_schema (
      schemaId       INTEGER PRIMARY KEY AUTOINCREMENT,
      datasetId      INTEGER NOT NULL,
      table_name     TEXT    NOT NULL,
      column_name    TEXT    NOT NULL,
      display_label  TEXT    NOT NULL,      -- shown as column header in UI
      data_type      TEXT    NOT NULL,      -- integer | real | text | timestamp
      is_primary_key INTEGER NOT NULL DEFAULT 0,
      is_nullable    INTEGER NOT NULL DEFAULT 0,
      is_filterable  INTEGER NOT NULL DEFAULT 1,   -- show filter widget?
      is_sortable    INTEGER NOT NULL DEFAULT 1,   -- allow sort by this col?
      is_visible     INTEGER NOT NULL DEFAULT 1,   -- show in default view?
      display_order  INTEGER NOT NULL DEFAULT 0,   -- column position in table
      format_hint    TEXT,                  -- 'unix_timestamp' | 'pipe_list' | 'star_rating'
      description    TEXT,
      FOREIGN KEY (datasetId) REFERENCES dataset_metadata(datasetId)
    );

    -- Aggregated stats per column — drives filter ranges, sample dropdowns
    CREATE TABLE IF NOT EXISTS column_stats (
      statId         INTEGER PRIMARY KEY AUTOINCREMENT,
      datasetId      INTEGER NOT NULL,
      table_name     TEXT    NOT NULL,
      column_name    TEXT    NOT NULL,
      min_value      TEXT,
      max_value      TEXT,
      distinct_count INTEGER,
      null_count     INTEGER DEFAULT 0,
      sample_values  TEXT,                  -- JSON array, up to 10 examples
      FOREIGN KEY (datasetId) REFERENCES dataset_metadata(datasetId)
    );
  `);

  return db;
}

// ─── 2. INSERT METADATA ──────────────────────────────────────────
function insertMetadata(db: Database.Database): number {
  const config = JSON.stringify({
    MOVIE_COUNT, RATINGS_PER_MOVIE, USER_COUNT,
    BATCH_SIZE, generated_at: new Date().toISOString(),
  });

  const { lastInsertRowid } = db.prepare(`
    INSERT INTO dataset_metadata
      (name, description, version, created_at,
       total_movies, total_ratings, total_users,
       ratings_per_movie, generator_config)
    VALUES (?,?,?,?,?,?,?,?,?)
  `).run(
    "movie-dashboard",
    "Synthetic movie, user and ratings dataset for dashboard development.",
    "1.0.0",
    new Date().toISOString(),
    MOVIE_COUNT,
    MOVIE_COUNT * RATINGS_PER_MOVIE,
    USER_COUNT,
    RATINGS_PER_MOVIE,
    config,
  );

  const id = Number(lastInsertRowid);

  // ── table_schema rows ─────────────────────────────────────────
  // These tell the frontend: what columns exist, how to label them,
  // what type they are, whether to show filters/sort, and in what order.
  const ins = db.prepare(`
    INSERT INTO table_schema
      (datasetId, table_name, column_name, display_label,
       data_type, is_primary_key, is_nullable,
       is_filterable, is_sortable, is_visible,
       display_order, format_hint, description)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  const schemas: unknown[][] = [
    // movies
    [id,"movies","movieId", "ID",      "integer",1,0, 0,1,0, 0, null,          "Primary key"],
    [id,"movies","title",   "Title",   "text",   0,0, 1,1,1, 1, null,          "Full movie title"],
    [id,"movies","genres",  "Genres",  "text",   0,0, 1,0,1, 2, "pipe_list",   "Genres separated by |"],
    [id,"movies","year",    "Year",    "integer",0,0, 1,1,1, 3, null,          "Release year (1970-2024)"],
    // users
    [id,"users","userId",    "ID",      "integer",1,0, 0,1,0, 0, null,         "Primary key"],
    [id,"users","name",      "Name",    "text",   0,0, 1,1,1, 1, null,         "Full name"],
    [id,"users","email",     "Email",   "text",   0,0, 1,1,1, 2, null,         "Unique email address"],
    [id,"users","country",   "Country", "text",   0,0, 1,1,1, 3, null,         "ISO country code"],
    [id,"users","age",       "Age",     "integer",0,0, 1,1,1, 4, null,         "Age 18-70"],
    [id,"users","created_at","Joined",  "integer",0,0, 0,1,1, 5, "unix_timestamp","Account creation date"],
    // ratings
    [id,"ratings","ratingId", "ID",      "integer",1,0, 0,1,0, 0, null,        "Primary key"],
    [id,"ratings","userId",   "User ID", "integer",0,0, 1,1,0, 1, null,        "Foreign key → users"],
    [id,"ratings","movieId",  "Movie ID","integer",0,0, 1,1,0, 2, null,        "Foreign key → movies"],
    [id,"ratings","rating",   "Rating",  "real",   0,0, 1,1,1, 3, "star_rating","0.5 – 5.0 stars"],
    [id,"ratings","timestamp","Date",    "integer",0,0, 1,1,1, 4, "unix_timestamp","When the rating was given"],
  ];

  const insertSchemas = db.transaction(() => {
    for (const row of schemas) ins.run(...row as Parameters<typeof ins.run>);
  });
  insertSchemas();

  return id;
}

// ─── 3. STREAM-BASED GENERATORS ──────────────────────────────────
//
// Each generator is a plain JS generator function (function*).
// It yields one row at a time — O(1) memory regardless of total count.
// The batcher below reads from it in BATCH_SIZE chunks and runs each
// chunk inside a single SQLite transaction (bulk insert).

function* movieGenerator(total: number): Generator<[number, string, string, number]> {
  for (let id = 1; id <= total; id++) {
    const year   = randomYear();
    const title  = makeTitle();
    const genres = pickN(GENRES, 1 + Math.floor(Math.random() * 2)).join("|");
    yield [id, title, genres, year];
  }
}

function* userGenerator(total: number): Generator<[number, string, string, string, number, number]> {
  for (let id = 1; id <= total; id++) {
    const firstName = pick(FIRST_NAMES);
    const lastName  = pick(LAST_NAMES);
    yield [
      id,
      `${firstName} ${lastName}`,
      makeEmail(firstName, lastName, id),
      pick(COUNTRIES),
      18 + Math.floor(Math.random() * 53), // age 18-70
      randomTimestamp(),
    ];
  }
}

function* ratingGenerator(
  movieCount: number,
  userCount: number,
  ratingsPerMovie: number,
): Generator<[number, number, number, number]> {
  for (let movieId = 1; movieId <= movieCount; movieId++) {
    // Pick unique users for this movie (avoid duplicate user+movie combos)
    const usedUsers = new Set<number>();
    for (let j = 0; j < ratingsPerMovie; j++) {
      let userId: number;
      do { userId = 1 + Math.floor(Math.random() * userCount); }
      while (usedUsers.has(userId));
      usedUsers.add(userId);
      yield [userId, movieId, weightedRandom(), randomTimestamp()];
    }
  }
}

// ─── 4. BULK WRITER ──────────────────────────────────────────────
// Reads from any generator in BATCH_SIZE chunks and commits each
// chunk as a single transaction. This is the key to performance:
// one transaction per 2000 rows vs one transaction per row = ~100x faster.

function streamToSQLite<T extends unknown[]>(
  db: Database.Database,
  label: string,
  sql: string,
  gen: Generator<T>,
  total: number,
): void {
  const stmt = db.prepare(sql);
  const insertBatch = db.transaction((rows: T[]) => {
    for (const row of rows) stmt.run(...row as Parameters<typeof stmt.run>);
  });

  let batch: T[] = [];
  let inserted = 0;

  for (const row of gen) {
    batch.push(row);
    if (batch.length >= BATCH_SIZE) {
      insertBatch(batch);
      inserted += batch.length;
      batch = [];
      progress(label, inserted, total);
    }
  }

  // Flush remaining rows
  if (batch.length > 0) {
    insertBatch(batch);
    inserted += batch.length;
  }

  progress(label, inserted, total);
  console.log(); // newline after progress bar
}

// ─── 5. COMPUTE COLUMN STATS ─────────────────────────────────────
// Run after all data is inserted. Computes min, max, distinct count,
// and a sample of 10 values per column. Stored in column_stats so
// the frontend can build filter ranges and dropdowns without extra queries.

function computeColumnStats(db: Database.Database, datasetId: number): void {
  console.log("\n  Computing column stats for metadata...");

  const ins = db.prepare(`
    INSERT INTO column_stats
      (datasetId, table_name, column_name,
       min_value, max_value, distinct_count, null_count, sample_values)
    VALUES (?,?,?,?,?,?,?,?)
  `);

  const tableCols: Record<string, string[]> = {
    movies:  ["title", "genres", "year"],
    users:   ["country", "age", "created_at"],
    ratings: ["rating", "timestamp"],
  };

  for (const [table, cols] of Object.entries(tableCols)) {
    for (const col of cols) {
      const stats = db.prepare(
        `SELECT MIN(${col}) as mn, MAX(${col}) as mx,
                COUNT(DISTINCT ${col}) as dc,
                SUM(CASE WHEN ${col} IS NULL THEN 1 ELSE 0 END) as nc
         FROM ${table}`
      ).get() as { mn: string; mx: string; dc: number; nc: number };

      const samples = (db.prepare(
        `SELECT DISTINCT ${col} FROM ${table} LIMIT 10`
      ).all() as Record<string, unknown>[]).map((r) => r[col]);

      ins.run(
        datasetId, table, col,
        String(stats.mn), String(stats.mx),
        stats.dc, stats.nc,
        JSON.stringify(samples),
      );
    }
  }
}

// ─── 6. MAIN ─────────────────────────────────────────────────────
async function main() {
  const totalRatings = MOVIE_COUNT * RATINGS_PER_MOVIE;

  console.log(`\n🎬  Movie Dashboard — Dataset Generator`);
  console.log(`    Movies  : ${MOVIE_COUNT.toLocaleString()}`);
  console.log(`    Users   : ${USER_COUNT.toLocaleString()}`);
  console.log(`    Ratings : ${totalRatings.toLocaleString()}  (${RATINGS_PER_MOVIE} per movie)`);
  console.log(`    Output  : ${DB_PATH}\n`);

  const t0 = Date.now();
  const db = setupDatabase();
  const datasetId = insertMetadata(db);

  // Stream movies
  console.log("  [1/3] Generating movies...");
  streamToSQLite(
    db,
    "movies ",
    "INSERT INTO movies (movieId, title, genres, year) VALUES (?,?,?,?)",
    movieGenerator(MOVIE_COUNT),
    MOVIE_COUNT,
  );

  // Stream users
  console.log("  [2/3] Generating users...");
  streamToSQLite(
    db,
    "users  ",
    "INSERT INTO users (userId, name, email, country, age, created_at) VALUES (?,?,?,?,?,?)",
    userGenerator(USER_COUNT),
    USER_COUNT,
  );

  // Stream ratings
  console.log("  [3/3] Generating ratings...");
  streamToSQLite(
    db,
    "ratings",
    "INSERT INTO ratings (userId, movieId, rating, timestamp) VALUES (?,?,?,?)",
    ratingGenerator(MOVIE_COUNT, USER_COUNT, RATINGS_PER_MOVIE),
    totalRatings,
  );

  // Compute and store column stats
  computeColumnStats(db, datasetId);

  // Build indexes after insert (much faster than during)
  console.log("\n  Building indexes...");
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_ratings_movieId  ON ratings(movieId);
    CREATE INDEX IF NOT EXISTS idx_ratings_userId   ON ratings(userId);
    CREATE INDEX IF NOT EXISTS idx_ratings_rating   ON ratings(rating);
    CREATE INDEX IF NOT EXISTS idx_movies_year      ON movies(year);
    CREATE INDEX IF NOT EXISTS idx_users_country    ON users(country);
  `);

  db.close();

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const totalRows = MOVIE_COUNT + USER_COUNT + totalRatings;
  console.log(`\n✅  Done in ${elapsed}s — ${totalRows.toLocaleString()} rows written to ${DB_PATH}`);
  console.log(`\n📋  Metadata tables written:`);
  console.log(`    dataset_metadata  — 1 row (dataset config + counts)`);
  console.log(`    table_schema      — ${15} rows (one per column)`);
  console.log(`    column_stats      — per-column min/max/distinct/samples`);
  console.log(`\n🚀  Your frontend can now query table_schema to build`);
  console.log(`    column headers, filters, and sort options dynamically.\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });