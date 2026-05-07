/**
 * generate-large-dataset.ts
 * ─────────────────────────────────────────────────────────────────
 * Generates millions of movie + rating rows using Node.js Streams.
 *
 * WHY STREAMS?
 *   Writing millions of rows all at once would exhaust memory.
 *   Node.js Readable/Transform/Writable streams pipe data through
 *   in small chunks so RAM stays flat regardless of output size.
 *
 * HOW TO RUN:
 *   npm run generate:fast
 *   -- or with options --
 *   MOVIE_COUNT=500000 RATINGS_PER_MOVIE=20 npm run generate:fast
 *
 * HOW TO THEN SEED THE DB:
 *   DATASET_NAME=generated-large npm run seed
 *
 * STREAMSETS / STREAMLIT NOTE:
 *   The tool you were thinking of is likely "StreamSets Data Collector"
 *   (https://streamsets.com) — a GUI pipeline tool for ETL at scale.
 *   For purely local Node.js generation, Node Streams give the same
 *   benefit: constant memory, backpressure, pipeline error handling.
 * ─────────────────────────────────────────────────────────────────
 */

import fs from "node:fs";
import path from "node:path";
import { Readable, Transform, pipeline } from "node:stream";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const pipelineAsync = promisify(pipeline);

// ─── Config (override via env) ────────────────────────────────────
const MOVIE_COUNT       = Number(process.env.MOVIE_COUNT       ?? 100_000);
const RATINGS_PER_MOVIE = Number(process.env.RATINGS_PER_MOVIE ?? 10);
const USER_COUNT        = Number(process.env.USER_COUNT        ?? 50_000);
const BATCH_SIZE        = 5_000; // rows per stream chunk

// ─── Static data pools ───────────────────────────────────────────
const GENRES = [
  "Action","Adventure","Animation","Comedy","Crime",
  "Documentary","Drama","Fantasy","Horror","Mystery",
  "Romance","Sci-Fi","Thriller","Western","Musical",
];

const TITLE_PREFIXES = [
  "The","A","Beyond","Into","Under","Above","Dark","Last","First",
  "Lost","Found","Broken","Shattered","Rising","Fallen","Silent",
  "Burning","Frozen","Hidden","Secret","Ancient","Final","Distant",
];

const TITLE_NOUNS = [
  "Dawn","Shadow","Echo","Storm","River","Mountain","Sky","Forest",
  "City","Kingdom","Empire","World","Mind","Heart","Soul","Dream",
  "Night","Light","Fire","Ice","Star","Moon","Sun","Wind","Ocean",
  "Desert","Island","Bridge","Tower","Door","Mirror","Clock","Road",
];

const TITLE_SUFFIXES = [
  "","","","", // mostly no suffix
  ": The Reckoning","Returns","Reborn","Rising","Begins","Forever",
  "2","3","II","III","Chronicles","Legacy","Origins","Unleashed",
];

const RATINGS_POOL = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
// Bias toward middle-high ratings
const RATINGS_WEIGHTS = [1, 2, 3, 5, 8, 12, 15, 18, 14, 10];
const RATINGS_CDF = buildCdf(RATINGS_WEIGHTS);

function buildCdf(weights: number[]) {
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  return weights.map((w) => (acc += w / total));
}

function weightedRandom(pool: number[], cdf: number[]) {
  const r = Math.random();
  for (let i = 0; i < cdf.length; i++) {
    if (r <= cdf[i]) return pool[i];
  }
  return pool[pool.length - 1];
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomYear() {
  return 1970 + Math.floor(Math.random() * 55); // 1970-2024
}

function randomTimestamp() {
  const start = new Date("2000-01-01").getTime();
  const end   = new Date("2024-12-31").getTime();
  return Math.floor((start + Math.random() * (end - start)) / 1000);
}

function csvEscape(v: string) {
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

function makeTitle(): string {
  const prefix = pick(TITLE_PREFIXES);
  const noun   = pick(TITLE_NOUNS);
  const suffix = pick(TITLE_SUFFIXES);
  return `${prefix} ${noun}${suffix}`;
}

// ─── Streaming movie generator ────────────────────────────────────
function createMovieStream(total: number): Readable {
  let id = 1;
  return new Readable({
    objectMode: true,
    read() {
      if (id > total) { this.push(null); return; }
      const batch: string[] = [];
      const end = Math.min(id + BATCH_SIZE - 1, total);
      for (; id <= end; id++) {
        const year   = randomYear();
        const title  = `${makeTitle()} (${year})`;
        const genres = pickN(GENRES, 1 + Math.floor(Math.random() * 2)).join("|");
        batch.push([id, csvEscape(title), csvEscape(genres)].join(","));
      }
      this.push(batch.join("\n") + "\n");
    },
  });
}

// ─── Streaming rating generator ───────────────────────────────────
function createRatingStream(movieCount: number): Readable {
  let movieId  = 1;
  let ratingId = 0;
  return new Readable({
    objectMode: true,
    read() {
      if (movieId > movieCount) { this.push(null); return; }
      const lines: string[] = [];
      const endMovie = Math.min(movieId + Math.ceil(BATCH_SIZE / RATINGS_PER_MOVIE), movieCount);
      for (; movieId <= endMovie; movieId++) {
        const usedUsers = new Set<number>();
        for (let j = 0; j < RATINGS_PER_MOVIE; j++) {
          let userId: number;
          do { userId = 1 + Math.floor(Math.random() * USER_COUNT); }
          while (usedUsers.has(userId));
          usedUsers.add(userId);
          ratingId++;
          const rating = weightedRandom(RATINGS_POOL, RATINGS_CDF);
          lines.push([userId, movieId, rating, randomTimestamp()].join(","));
        }
      }
      this.push(lines.join("\n") + "\n");
    },
  });
}

// ─── Main ─────────────────────────────────────────────────────────
async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outputDir = path.join(__dirname, "..", "data", "generated-large");
  fs.mkdirSync(outputDir, { recursive: true });

  const moviesPath  = path.join(outputDir, "movies.csv");
  const ratingsPath = path.join(outputDir, "ratings.csv");

  const totalRatings = MOVIE_COUNT * RATINGS_PER_MOVIE;
  console.log(`\n🎬 Generating dataset via Node.js Streams`);
  console.log(`   Movies  : ${MOVIE_COUNT.toLocaleString()}`);
  console.log(`   Ratings : ${totalRatings.toLocaleString()}  (${RATINGS_PER_MOVIE}/movie)`);
  console.log(`   Users   : ${USER_COUNT.toLocaleString()}`);
  console.log(`   Output  : ${outputDir}\n`);

  // ── Write movies.csv ──────────────────────────────────────────
  process.stdout.write("Writing movies.csv  ");
  const movieStart = Date.now();
  const movieFile  = fs.createWriteStream(moviesPath);
  movieFile.write("movieId,title,genres\n");

  let moviesDone = 0;
  const movieProgress = new Transform({
    transform(chunk, _enc, cb) {
      moviesDone += (chunk as Buffer).toString().split("\n").filter(Boolean).length;
      const pct = Math.floor((moviesDone / MOVIE_COUNT) * 100);
      process.stdout.write(`\rWriting movies.csv   ${pct}% (${moviesDone.toLocaleString()})`);
      this.push(chunk);
      cb();
    },
  });

  await pipelineAsync(createMovieStream(MOVIE_COUNT), movieProgress, movieFile);
  console.log(`\n✅ movies.csv   done in ${((Date.now() - movieStart) / 1000).toFixed(1)}s`);

  // ── Write ratings.csv ─────────────────────────────────────────
  process.stdout.write("Writing ratings.csv ");
  const ratingStart = Date.now();
  const ratingFile  = fs.createWriteStream(ratingsPath);
  ratingFile.write("userId,movieId,rating,timestamp\n");

  let ratingsDone = 0;
  const ratingProgress = new Transform({
    transform(chunk, _enc, cb) {
      ratingsDone += (chunk as Buffer).toString().split("\n").filter(Boolean).length;
      const pct = Math.floor((ratingsDone / totalRatings) * 100);
      process.stdout.write(`\rWriting ratings.csv  ${pct}% (${ratingsDone.toLocaleString()})`);
      this.push(chunk);
      cb();
    },
  });

  await pipelineAsync(createRatingStream(MOVIE_COUNT), ratingProgress, ratingFile);
  console.log(`\n✅ ratings.csv  done in ${((Date.now() - ratingStart) / 1000).toFixed(1)}s`);

  const moviesSize  = (fs.statSync(moviesPath).size  / 1024 / 1024).toFixed(1);
  const ratingsSize = (fs.statSync(ratingsPath).size / 1024 / 1024).toFixed(1);
  console.log(`\n📦 File sizes:`);
  console.log(`   movies.csv  : ${moviesSize} MB`);
  console.log(`   ratings.csv : ${ratingsSize} MB`);
  console.log(`\n🚀 Next step — seed the DB:`);
  console.log(`   DATASET_NAME=generated-large npm run seed\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
