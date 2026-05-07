# 📝 How to Add a Blog

This folder contains all user portfolios and blogs.

Each user has their own folder.

---

## 📂 Folder Structure

```
portfolios/
├── your-username/
│   ├── my-first-blog.md
│   ├── another-blog.md
```

---

## 🧑‍💻 Step 1: Create Your Folder

Create a folder using your GitHub username:

```
your-username/
```

Example:

```
rajat-acog/
```

---

## ✍️ Step 2: Create a Blog File

Create a `.md` file inside your folder:

```
my-first-blog.md
```

---

## 📄 Blog Template

Use this structure:

```
---
title: "Your Blog Title"
author: "your-username"
date: "YYYY-MM-DD"
position: "your-position at aganitha"
---

## 🚀 Introduction

Write your intro here...

---

## 🧩 Problem Statement

Explain the problem...

---

## ⚙️ Solution

Describe your approach...

---

## 📊 Results

Add results or outcomes...

---

## 🎯 Conclusion

Wrap it up...
```

---

## ⚠️ Rules

- File must end with `.md`

- Use **kebab-case** for file names
  ✅ `my-first-blog.md`
  ❌ `My First Blog.md`

- Folder name must match your GitHub username

---

## 🤝 Contributors (IMPORTANT)

You do NOT need to add co-authors manually.

👉 If someone:

- edits your blog
- commits changes

➡️ They will automatically appear as a contributor

---

## 🔄 Workflow

```bash
git add .
git commit -m "Added blog on XYZ"
git push
```

Then:

```bash
npm run build
```

---

## 🧠 Tips

- Use clear headings (`##`)
- Keep content structured
- Avoid very large files
- Use meaningful commit messages (they matter!)

---

## 💡 Example

```
portfolios/
└── swati-acog/
    └── winters.md
```

---

## 🚨 Common Mistakes

❌ Wrong folder name
❌ Missing frontmatter
❌ Wrong file path
❌ Not pushing commits

---

## ✅ You're Done!

Once pushed:

- Your blog appears on the website
- Contributors update automatically 🎉
