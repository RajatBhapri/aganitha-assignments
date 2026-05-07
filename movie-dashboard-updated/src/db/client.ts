import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath = path.join(process.cwd(), "data", "movies.db");

if (!fs.existsSync(dbPath)) {
  throw new Error(
    `Database not found at: ${dbPath}\n` +
    `Run: npm run seed\n` +
    `Or to generate data first: npm run generate:fast && DATASET_NAME=generated-large npm run seed`
  );
}

export const db = new Database(dbPath, { readonly: true });
