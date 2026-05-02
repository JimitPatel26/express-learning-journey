# 📁 02 — Static Files

> **Concept:** How Express serves files directly from a folder and how to send HTML files as responses.

---

## 📌 What You Learn Here

- Serving static files automatically with `express.static()`
- Sending an HTML file using `res.sendFile()`
- Using `path.resolve()` and `__dirname` for safe file paths
- Middleware concept (first look)

---

## 🚀 Run This

```bash
node index.js
# Server at http://localhost:3120
```

| URL | What Happens |
|-----|-------------|
| `http://localhost:3120/` | Serves `app/index.html` |
| `http://localhost:3120/some.txt` | Serves `public/some.txt` automatically |
| `http://localhost:3120/anything-else` | 404 — Resources Not Found |

---

## 📂 Folder Structure

```
02-static-files/
├── index.js
├── app/
│   └── index.html      ← served manually via res.sendFile()
└── public/
    └── some.txt        ← served automatically via express.static()
```

---

## 🧠 Core Concepts

### 1. express.static() — Auto Serve Files

```js
app.use(express.static('./public'));
```

- Tells Express: *"serve any file found in `public/` directly"*
- No route needed — Express handles it automatically
- File `public/some.txt` → accessible at `/some.txt`

```
Request: GET /some.txt
Express checks public/ folder → finds some.txt → sends it ✅
```

> This is **middleware** — code that runs before your route handlers.

---

### 2. res.sendFile() — Send an HTML File

```js
res.sendFile(path.resolve(__dirname, "./app/index.html"));
```

- Sends a file as the HTTP response
- ⚠️ Requires an **absolute path** — relative paths will break

---

### 3. path.resolve() and __dirname

```js
const path = require('path');

path.resolve(__dirname, "./app/index.html")
```

| Part | What it means |
|------|--------------|
| `__dirname` | Absolute path to the folder of the current JS file |
| `path.resolve()` | Combines paths into a safe absolute path |

**Why not just write `"./app/index.html"`?**

```
Relative paths resolve from wherever `node` was run — not the file.
This breaks if you run the server from a different directory.
path.resolve(__dirname, ...) always works correctly. ✅
```

---

### 4. How They Work Together

```
Request: GET /
→ express.static checks public/ → no index.html there
→ falls through to app.get("/")
→ res.sendFile sends app/index.html ✅

Request: GET /some.txt
→ express.static checks public/ → finds some.txt → sends it ✅
→ route handlers below never run
```

> **Order matters:** `express.static()` runs first. If it finds the file, it responds immediately.

---

## 💻 Full Code

```js
const express = require("express");
const path = require("path");
const app = express();

// Middleware — serve files from public/ automatically
app.use(express.static('./public'));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/index.html"));
});

app.use((req, res) => {
    res.status(404).send("Resources Not Found");
});

app.listen(3120, () => {
    console.log("http://localhost:3120");
});
```

---

## ❓ Revision Questions

1. What does `express.static()` do? Why don't you need a route for those files?
2. Why can't you pass a relative path to `res.sendFile()`?
3. What is `__dirname`?
4. If both `express.static()` and a `GET /` route exist, which runs first?
5. What is middleware?

---

> 💡 **Tip:** Put files that anyone can access (CSS, images, JS) in `public/`. Files that should only be served via a specific route (like HTML pages) go elsewhere.