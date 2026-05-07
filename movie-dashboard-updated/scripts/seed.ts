/**
 * seed.ts
 * ─────────────────────────────────────────────────────────────────
 * Reads CSVs from data/<DATASET_NAME>/ and seeds movies.db.
 * Streams CSV line-by-line so even 1M-row files stay memory-safe.
 *
 * Usage:
 *   npm run seed                                  # uses ml-latest-small
 *   DATASET_NAME=generated-large npm run seed     # large generated set
 *   DATASET_NAME=generated-llm   npm run seed     # LLM-generated set
 * ─────────────────────────────────────────────────────────────────
 */

import Database from "better-sqlite3";
import fs from "node:fs";
import readline from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir    = path.join(__dirname, "..");
const dataDir    = path.join(rootDir, "data");
const datasetName = "generated-large";
const csvDir     = path.join(dataDir, datasetName);
const dbPath     = path.join(dataDir, "movies.db");

function extractYear(title: string) {
  const m = title.match(/\((\d{4})\)\s*$/);
  return m ? Number(m[1]) : null;
}

function splitCsvLine(line: string): string[] {
  const vals: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i], n = line[i + 1];
    if (c === '"') {
      if (inQ && n === '"') { cur += '"'; i++; } else inQ = !inQ;
    } else if (c === "," && !inQ) {
      vals.push(cur); cur = "";
    } else cur += c;
  }
  vals.push(cur);
  return vals;
}

async function streamCsv(filePath: string): Promise<string[][]> {
  const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });
  const rows: string[][] = [];
  let first = true;
  for await (const line of rl) {
    if (first) { first = false; continue; } // skip header
    if (line.trim()) rows.push(splitCsvLine(line));
  }
  return rows;
}

async function main() {
  if (!fs.existsSync(csvDir)) {
    console.error(`Dataset folder not found: ${csvDir}`);
    console.error(`Available datasets: ${fs.readdirSync(dataDir).filter((d) => fs.statSync(path.join(dataDir, d)).isDirectory()).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n📦 Seeding: ${datasetName} → ${dbPath}`);

  const db = new Database(dbPath);

  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous  = NORMAL;
    DROP TABLE IF EXISTS ratings;
    DROP TABLE IF EXISTS movies;
    CREATE TABLE movies (
      id      INTEGER PRIMARY KEY,
      title   TEXT    NOT NULL,
      year    INTEGER,
      genres  TEXT    NOT NULL
    );
    CREATE TABLE ratings (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id   INTEGER NOT NULL,
      movie_id  INTEGER NOT NULL,
      rating    REAL    NOT NULL,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (movie_id) REFERENCES movies(id)
    );
    CREATE INDEX idx_movies_year         ON movies(year);
    CREATE INDEX idx_ratings_movie_id    ON ratings(movie_id);
    CREATE INDEX idx_ratings_rating      ON ratings(rating);
    CREATE INDEX idx_ratings_timestamp   ON ratings(timestamp);
  `);

  const insertMovie  = db.prepare("INSERT INTO movies  (id, title, year, genres) VALUES (?, ?, ?, ?)");
  const insertRating = db.prepare("INSERT INTO ratings (user_id, movie_id, rating, timestamp) VALUES (?, ?, ?, ?)");

  console.log("Reading movies.csv…");
  const movieRows = await streamCsv(path.join(csvDir, "movies.csv"));
  console.log(`  ${movieRows.length.toLocaleString()} rows — inserting…`);
  db.transaction(() => {
    for (const [id, title, genres] of movieRows) {
      insertMovie.run(Number(id), title, extractYear(title), genres);
    }
  })();

  console.log("Reading ratings.csv…");
  const ratingRows = await streamCsv(path.join(csvDir, "ratings.csv"));
  console.log(`  ${ratingRows.length.toLocaleString()} rows — inserting…`);

  // Insert ratings in chunks to show progress
  const CHUNK = 50_000;
  for (let i = 0; i < ratingRows.length; i += CHUNK) {
    const chunk = ratingRows.slice(i, i + CHUNK);
    db.transaction(() => {
      for (const [userId, movieId, rating, ts] of chunk) {
        insertRating.run(Number(userId), Number(movieId), Number(rating), Number(ts));
      }
    })();
    const pct = Math.min(100, Math.floor(((i + CHUNK) / ratingRows.length) * 100));
    process.stdout.write(`\r  Progress: ${pct}%  `);
  }
  console.log();

  const mc = (db.prepare("SELECT COUNT(*) as c FROM movies").get()  as { c: number }).c;
  const rc = (db.prepare("SELECT COUNT(*) as c FROM ratings").get() as { c: number }).c;

  console.log(`\n✅ Seed complete`);
  console.log(`   Movies : ${mc.toLocaleString()}`);
  console.log(`   Ratings: ${rc.toLocaleString()}`);
  console.log(`   DB     : ${dbPath}\n`);

  db.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
