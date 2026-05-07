# 🚀 Portfolio Blog Platform

A dynamic portfolio + blogging platform built with **Astro**, where:

- Each user has their own portfolio
- Blogs are written in Markdown
- Contributors are **automatically detected from GitHub commits**

---

## ✨ Features

- 🧑‍💻 Multi-user portfolio system
- 📝 Markdown-based blog writing
- 🤝 Automatic co-author detection (via GitHub commits)
- ⚡ Static site generation (fast + SEO friendly)
- 🎯 Clean UI with sidebar navigation

---

## 📂 Project Structure

```
portfolio/
├── src/
│   ├── content/
│   │   └── portfolios/
│   │       ├── username/
│   │       │   ├── blog-1.md
│   │       │   └── blog-2.md
│   ├── pages/
│   │   └── portfolio/[slug]/[blog].astro
```

---

## 🛠️ Setup

```bash
git clone <repo-url>
cd portfolio
npm install
npm run dev
```

---

## 🏗️ Build & Preview

```bash
npm run build
npm run preview
```

---

## 🤝 How Contributors Work

This project automatically detects contributors based on:

👉 GitHub commit history of each blog file

### ✔️ Rules:

- If someone edits a blog → they become a contributor
- No need to manually add names
- Contributors appear under the blog title

---

## ⚠️ Important Notes

- Make sure commits are made using a GitHub account (not just email)
- The file path must remain consistent:

  ```
  portfolio/src/content/portfolios/<username>/<blog>.md
  ```

---

## 📌 Workflow

1. Create or edit a blog
2. Commit changes
3. Push to GitHub
4. Rebuild the site

👉 Contributors will update automatically 🎉

---

## 🧠 Future Improvements

- Contributor badges
- Commit count display
- Profile enrichment
- Database integration (instead of static content)

---

## 📬 Contributing

- Follow the blog template (see `/portfolios/README.md`)
- Keep file naming clean
- Use meaningful commit messages

---

## 🧑‍🚀 Maintainer

Built for scalable collaboration and clean developer workflows.
