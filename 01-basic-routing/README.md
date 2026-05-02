# 📁 01 — Basic Routing

> **Concept:** How Express handles incoming HTTP requests and sends responses back.

---

## 📌 What You Learn Here

- Creating an Express app
- Defining GET routes
- Sending HTML responses
- Setting status codes
- Catch-all 404 handler

---

## 🚀 Run This

```bash
node index.js
# Server at http://localhost:3120
```

| URL | Response |
|-----|----------|
| `http://localhost:3120/` | Home Page |
| `http://localhost:3120/about` | About Page |
| `http://localhost:3120/anything-else` | 404 Page Not Found |

---

## 🧠 Core Concepts

### 1. Creating the App

```js
const express = require("express");
const app = express();
```

> `app` is your Express application. All routes and middleware are registered on it.

---

### 2. Defining a Route

```js
app.METHOD(PATH, HANDLER)
```

| Part | What it is |
|------|-----------|
| `METHOD` | HTTP method — `get`, `post`, `put`, `delete` |
| `PATH` | URL string — `"/"`, `"/about"` |
| `HANDLER` | Function that runs when route matches |

```js
app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>");
});
```

---

### 3. req and res

```
req  →  what the browser/client sends TO the server
res  →  what the server sends BACK to the client
```

---

### 4. res.send()

```js
res.send("<h1>Hello</h1>"); // sends HTML string
```

> Use `res.send()` for plain text or HTML. For JSON use `res.json()`.

---

### 5. Status Codes

```js
res.status(200).send("OK");         // success
res.status(404).send("Not Found");  // not found
res.status(500).send("Error");      // server error
```

| Code | Meaning |
|------|---------|
| `200` | OK — succeeded |
| `201` | Created |
| `400` | Bad Request |
| `404` | Not Found |
| `500` | Server Error |

> If you skip `.status()`, Express defaults to `200`.

---

### 6. Catch-All 404 Handler

```js
app.use((req, res) => {
    res.status(404).send("<h1>Page Not Found</h1>");
});
```

- `app.use()` without a path matches **every** request
- Acts like an `else` block — runs only when no route above matched
- ⚠️ **Always place this at the very bottom**

---

### 7. Starting the Server

```js
app.listen(3120, () => {
    console.log("Server started at http://localhost:3120");
});
```

> `app.listen(PORT, callback)` — callback runs once server is ready.

---

## 💻 Full Code

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>");
});

app.get("/about", (req, res) => {
    res.status(200).send("<h1>About Page</h1>");
});

app.use((req, res) => {
    res.status(404).send("<h1>Page Not Found</h1>");
});

app.listen(3120, () => {
    console.log("Server started at http://localhost:3120");
});
```

---

## ❓ Revision Questions

1. What is the difference between `app.get()` and `app.use()`?
2. Why must the 404 handler always be at the bottom?
3. What is the default status code if you don't call `.status()`?
4. What do `req` and `res` represent?

---

> 💡 **Tip:** Express reads routes **top to bottom** and stops at the first match.