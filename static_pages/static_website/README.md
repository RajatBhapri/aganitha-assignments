# 📦 Static React Website (Vite + TypeScript)

## 📖 Synopsis

This project is a **static website built using React, Vite, and TypeScript**. It uses **client-side routing** via `react-router-dom` to navigate between multiple pages like Home, About, Contact, and an API page.

The app is configured to be served under a sub-path (`/react`) using the `basename` in the router, making it suitable for deployment in a subdirectory (e.g., behind Nginx or a static hosting folder).

It is optimized for:

- ⚡ Fast development with Vite
- 📦 Static production builds
- 🔀 Simple routing without backend dependency
- 🚀 Easy deployment via manual copy script

---

## 🧱 Tech Stack

- React 19
- Vite
- TypeScript
- React Router DOM
- ESLint

---

## 📂 Project Structure (Simplified)

```
src/
 ├── pages/
 │   ├── Home.tsx
 │   ├── About.tsx
 │   ├── Contact.tsx
 │   └── ApiPage.tsx
 ├── App.tsx
 └── main.tsx
```

---

## 🚀 Available Scripts

### 🔧 Install Dependencies

```bash
npm install
```

### 🧪 Run Development Server

```bash
npm run dev
```

- Starts Vite dev server
- Default: http://localhost:5173

---

### 🏗️ Build for Production

```bash
npm run build
```

- Runs TypeScript compiler
- Generates optimized static files in `dist/`

---

### 👀 Preview Production Build

```bash
npm run preview
```

- Serves the built app locally

---

### 🚀 Deploy Static Build

```bash
npm run deploy
```

- Deletes old files from:

  ```
  /home/brajat/assignment/static_pages/react_build/
  ```

- Copies new build from `dist/` to deployment directory

> ⚠️ Make sure the target path exists and permissions are correct.

---

### 🧹 Lint Code

```bash
npm run lint
```

---

## 🌐 Routing

The app uses `BrowserRouter` with a base path:

```tsx
<BrowserRouter basename="/react">
```

### Available Routes:

- `/` → Home
- `/about` → About
- `/contact` → Contact
- `/api` → API Page

> ⚠️ Important: When deploying, ensure your server rewrites all routes to `index.html` (especially if using Nginx).

---

## 📦 Build Output

All static assets are generated inside:

```
dist/
```

These files can be served using:

- Nginx
- Apache
- Any static hosting service

---

## ⚙️ Deployment Notes

- Ensure your server serves the app under `/react`
- Configure fallback to `index.html` for SPA routing

Example (Nginx):

```nginx
location /react/ {
  root /var/www;
  try_files $uri /react/index.html;
}
```

---

## 🧠 Key Highlights

- Minimal and fast setup
- Fully static (no backend required)
- Easy to host anywhere
- Clean routing structure

---

## 📌 Future Improvements

- Add lazy loading for routes
- Add SEO meta handling
- Integrate API error handling UI
- Add global state management if needed

---

## 👨‍💻 Author

Rajat

---
