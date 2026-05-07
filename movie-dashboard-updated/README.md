# 🎬 Movie Analytics Dashboard (Updated)

A **high-performance, full-stack movie analytics dashboard** built with **Next.js 16**, **SQLite**, **shadcn/ui**, **Recharts**, and **Node.js Streams**.

This project is designed to handle **millions of rows efficiently** using **streaming pipelines**, while providing a modern, interactive UI.

---

# 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI System:** shadcn/ui (Radix + lucide-react)
- **Styling:** Tailwind CSS v4
- **Database:** SQLite (better-sqlite3)
- **Charts:** Recharts
- **AI Integration:** OpenAI / Ollama
- **Dataset Generation:** Node.js Streams + @faker-js/faker
- **Runtime Scripts:** tsx

---

# ✨ Features

## 🧩 UI & Architecture

| Feature                  | Details                                                        |
| ------------------------ | -------------------------------------------------------------- |
| **shadcn/ui everywhere** | All UI components replaced (Button, Card, Select, Table, etc.) |
| **No hardcoding**        | Config-driven (`.env`, DB, constants)                          |
| **Modular architecture** | Clean separation (UI / DB / API / scripts)                     |

---

## 📊 Dashboard

- Interactive charts
- Genre-based filtering (click → updates all charts)
- KPI cards (Total Movies, Avg Rating, etc.)
- Fully DB-driven (no static data)

---

## 🔍 Data Explorer (`/explorer`)

- Large dataset viewer
- Filtering (genre, search)
- Sorting & pagination
- Built with optimized table rendering

---

## 🤖 AI “Ask Me” (Optional)

- Ask questions about dataset
- Powered by:
  - OpenAI OR
  - Ollama

---

## ⚡ Large Dataset Support

- Generate **millions of rows**
- Stream data without memory crash
- Works efficiently even at scale

---

# 🧠 Architecture Overview

```text
Dataset Generator (Streams)
        ↓
NDJSON / CSV Files
        ↓
Streaming Seeder
        ↓
SQLite Database
        ↓
Next.js API Layer
        ↓
UI (Dashboard + Explorer)
```

---

# 📁 Project Structure

```bash
src/
  app/
    page.tsx                  # Landing / Home
    dashboard/page.tsx        # Dashboard UI
    explorer/page.tsx         # Data Explorer
    api/
      charts/route.ts         # Chart data API
      genres/route.ts         # Genre API
      explorer/route.ts       # Table API
      ask/route.ts            # AI API

  components/
    ui/                       # shadcn/ui components
    DashboardClient.tsx
    FilterPanel.tsx
    SummaryCards.tsx
    GenrePieChart.tsx
    MoviesByGenreChart.tsx
    RatingTrendChart.tsx
    TopMoviesChart.tsx
    ExplorerClient.tsx
    AskMeWidget.tsx

  db/
    client.ts
    queries.ts

  lib/
    types.ts
    utils.ts

scripts/
  seed.ts
  generate-large-dataset.ts
  generate-llm-dataset.ts

data/
  generated-large/
  generated-llm/
  movies.db
```

---

# ⚙️ Setup Instructions

## 1️⃣ Install dependencies

```bash
npm install
```

---

## 2️⃣ Generate dataset

### ⚡ Fast generator (Streams)

```bash
npm run generate:fast
```

### 🤖 LLM dataset (Ollama)

```bash
npm run generate
```

---

## 3️⃣ Seed database

```bash
npm run seed
```

---

## 4️⃣ Start development

```bash
npm run dev
```

👉 Open: http://localhost:3000

---

## 5️⃣ Production

```bash
npm run build
npm start
```

---

# 📦 Scripts

```json
"dev": "next dev",
"build": "next build",
"lint": "eslint",
"seed": "tsx scripts/seed.ts",
"generate:fast": "tsx scripts/generate-large-dataset.ts",
"generate": "rm movie_dashboard.db && tsx scripts/generate-llm-dataset.ts",
"setup": "npm run seed && echo 'Setup complete!'",
"start": "next start -H 0.0.0.0 -p 3000"
```

---

# 🧪 Large Dataset Generation

## Node.js Streams (Core Concept)

Instead of loading everything into memory:

- **Readable stream** → generates rows
- **Transform stream** → processes / tracks progress
- **Writable stream** → writes to file

👉 Result:

- Constant memory usage (~50MB)
- Handles **1M → 100M rows**

---

## Example

```bash
# 100k movies × 10 ratings = 1M rows
npm run generate:fast

# Custom large dataset
MOVIE_COUNT=1000000 RATINGS_PER_MOVIE=20 npm run generate
```

---

# 🔄 Data Pipeline Workflow

1. Initialize database
2. Insert metadata
3. Generate movies
4. Generate users
5. Generate ratings
6. Compute stats
7. Create indexes

---

# ⚡ Performance Highlights

| Feature               | Benefit            |
| --------------------- | ------------------ |
| Streaming generation  | No memory overflow |
| Batch DB inserts      | High speed         |
| SQLite                | Lightweight + fast |
| No API dependency     | Zero latency       |
| Server-side rendering | Optimized UI       |

---

# ❌ Why Minimal API Usage?

- Faster (no network calls)
- Fully offline capable
- Better control over data
- Designed for **data engineering workflows**

---

# 🔮 Future Enhancements

- Advanced filters (range sliders, multi-select)
- Virtualized tables (for 10M+ rows UI)
- AI recommendations engine
- Real movie API integration (hybrid model)
- Export tools (CSV, JSON)
- Role-based access (auth system)

---

# 🧠 Key Learnings

- Handling large-scale datasets
- Using **streams for scalability**
- Building DB-driven dashboards
- Optimizing performance in Next.js
- Designing modular systems

---

# 👨‍💻 Author

Rajat

---

# 🚀 Final Note

This is not just a dashboard —
it’s a **scalable data platform prototype** demonstrating:

> Efficient data generation → streaming → storage → querying → visualization

---

Enjoy building 🚀
