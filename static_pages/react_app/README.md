# 📦 React App with DataTable & Routing (Vite + TypeScript)

## 📖 Synopsis

This project is a **feature-rich static React application** built using **Vite, TypeScript, and TailwindCSS**, with **client-side routing** and **data visualization capabilities**.

It extends a basic multi-page React setup by adding:

* 📊 Data tables using **jQuery DataTables**
* 🌐 API data fetching pages
* 📝 Posts listing page
* 🎨 TailwindCSS for styling

The app is designed to be deployed as a **static site**, served via Nginx or any static hosting environment.

---

## 🧱 Tech Stack

* React 19
* Vite
* TypeScript
* React Router DOM
* TailwindCSS
* jQuery + DataTables
* ESLint

---

## 📂 Project Structure (Simplified)

```bash
src/
 ├── pages/
 │   ├── Home.tsx
 │   ├── About.tsx
 │   ├── Contact.tsx
 │   ├── ApiPage.tsx
 │   ├── Posts.tsx
 │   └── DataTablePage.tsx
 ├── App.tsx
 └── main.tsx
```

---

## 🌐 Routing

Client-side routing is handled using `react-router-dom`.

### Available Routes:

* `/` → Home
* `/about` → About
* `/contact` → Contact
* `/api` → API Page (fetching external data)
* `/posts` → Posts listing
* `/datatable` → DataTable view (interactive table)

---

## 🚀 Available Scripts

### 🔧 Install Dependencies

```bash
npm install
```

---

### 🧪 Run Development Server

```bash
npm run dev
```

* Starts Vite dev server
* Default: http://localhost:5173

---

### 🏗️ Build for Production

```bash
npm run build
```

* Compiles TypeScript
* Generates optimized static files in `dist/`

---

### 👀 Preview Production Build

```bash
npm run preview
```

---

### 🧹 Lint Code

```bash
npm run lint
```

---

### 🚀 Deploy Application

```bash
npm run deploy
```

This script:

1. Builds the project
2. Clears old files from:

   ```
   ~/assignment/static_pages/react_build/
   ```
3. Copies new build (`dist/`)
4. Restarts Nginx server

> ⚠️ Requires sudo privileges for restarting Nginx.

---

## 📊 DataTable Integration

This project uses:

* `datatables.net`
* `jquery`

### Features:

* Sorting
* Pagination
* Search
* Dynamic data rendering

> ⚠️ Note: Since DataTables depends on jQuery, ensure proper initialization inside React lifecycle methods (e.g., `useEffect`).

---

## 🎨 Styling (TailwindCSS)

* Utility-first CSS framework
* Configured using PostCSS
* Enables rapid UI development

---

## 📦 Build Output

Production-ready files are generated in:

```bash
dist/
```

---

## ⚙️ Deployment Notes

### Nginx Configuration Example:

```nginx
location / {
  root /home/your-user/assignment/static_pages/react_build;
  index index.html;
  try_files $uri /index.html;
}
```

* Ensures proper routing fallback for SPA
* Required for React Router to work in production

---

## 🧠 Key Highlights

* Multi-page SPA using React Router
* Data visualization with DataTables
* TailwindCSS for modern UI
* Simple static deployment workflow
* API integration ready

---

## 📌 Future Improvements

* Replace jQuery DataTables with React-based table (e.g., TanStack Table)
* Add global state management (Redux/Zustand)
* Improve SEO handling
* Add loading/error states for API calls
* Code splitting (lazy loading routes)

---

## 👨‍💻 Author

Rajat

---
