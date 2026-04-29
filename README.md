# 📓 Express JS — Learning Journal

> **How to use this file:** Read top to bottom for a full revision. Each section has the concept, the syntax, and a real example from your own code.

---

## 📌 Table of Contents

1. [What is Express?](#1-what-is-express)
2. [Setting Up](#2-setting-up)
3. [Basic Routing](#3-basic-routing)
4. [Status Codes](#4-status-codes)
5. [Catch-All & 404 Handler](#5-catch-all--404-handler)
6. [Serving Static Files](#6-serving-static-files)
7. [Sending HTML Files](#7-sending-html-files)
8. [REST API & res.json()](#8-rest-api--resjson)
9. [Route Parameters](#9-route-parameters)
10. [Nested Route Parameters](#10-nested-route-parameters)
11. [Query Strings](#11-query-strings)
12. [Filtering & Limiting Data](#12-filtering--limiting-data)
13. [Separating Data (Mock DB)](#13-separating-data-mock-db)
14. [Module Exports & Require](#14-module-exports--require)
15. [Key Concepts Cheatsheet](#15-key-concepts-cheatsheet)

---

## 1. What is Express?

Express is a **minimal Node.js web framework** that makes it easy to:
- Handle HTTP requests (GET, POST, PUT, DELETE)
- Send responses (HTML, JSON, files)
- Build REST APIs

```js
const express = require("express");
const app = express();
```

`app` is your Express application. Everything is built on top of it.

---

## 2. Setting Up

```js
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
```

> `app.listen(PORT, callback)` starts your server.  
> The callback runs once the server is ready.

**Your code used two ports:**
- `basic-routing.js` → port `3120`
- `products-api.js` → port `5000`

---

## 3. Basic Routing

**Syntax:**
```js
app.METHOD(PATH, HANDLER)
```

| Part | Meaning |
|------|---------|
| `METHOD` | HTTP method: `get`, `post`, `put`, `delete` |
| `PATH` | URL path like `"/"` or `"/about"` |
| `HANDLER` | Function `(req, res) => {}` |

**Your code (`basic-routing.js`):**
```js
app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>");
});

app.get("/about", (req, res) => {
    res.status(200).send("<h1>About Page</h1>");
});
```

> `req` = request (what the browser sends to server)  
> `res` = response (what the server sends back)

---

## 4. Status Codes

```js
res.status(200).send("OK");           // Success
res.status(404).send("Not Found");    // Not found
res.status(500).send("Server Error"); // Server error
```

| Code | Meaning |
|------|---------|
| `200` | OK — request succeeded |
| `201` | Created — resource created |
| `400` | Bad Request |
| `404` | Not Found |
| `500` | Internal Server Error |

> If you don't call `.status()`, Express defaults to `200`.

---

## 5. Catch-All & 404 Handler

```js
app.use((req, res) => {
    res.status(404).send("<h1>Page Not Found</h1>");
});
```

- `app.use()` matches **every** request that didn't match a route above it.
- **Order matters!** Always put this at the **bottom**.

> Think of it like an `else` block — it runs when nothing else matched.

---

## 6. Serving Static Files

```js
app.use(express.static('./public'));
```

This tells Express: *"If someone requests a file that exists in the `public` folder, just send it directly."*

**Example:**
- File: `public/some.txt`
- URL: `http://localhost:3120/some.txt` → serves the file automatically

> No route needed. Express handles it for you.

**Your code (`static-files.js`):**
```js
app.use(express.static('./public'))
```

---

## 7. Sending HTML Files

```js
const path = require('path');

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/index.html"));
});
```

- `path.resolve()` builds an **absolute path** (safe across all OS)
- `__dirname` = the directory where the current JS file lives
- `res.sendFile()` sends an HTML file as the response

> This is how `static-files.js` served your `index.html` with "Welcome to the Express JS !!"

---

## 8. REST API & res.json()

```js
res.json(data); // Sends data as JSON with correct Content-Type header
```

**Your code (`products-api.js`):**
```js
app.get('/api/products', (req, res) => {
    const newProducts = product.map((p) => {
        const { id, name, image, price } = p;
        return { id, name, image, price };
    });
    res.json(newProducts);
});
```

> Notice: `desc` is excluded from the response using destructuring.  
> This is a common API pattern — only expose what the client needs.

---

## 9. Route Parameters

Route parameters are **dynamic parts of a URL**, prefixed with `:`.

```js
app.get("/api/products/:productId", (req, res) => {
    const id = req.params.productId; // access via req.params
});
```

**Your code:**
```js
app.get("/api/products/:productId", (req, res) => {
    const singleProduct = product.find((p) => {
        return p.id === Number(req.params.productId);
    });

    if (!singleProduct) {
        return res.status(404).send("Product Does not Exist");
    }

    res.json(singleProduct);
});
```

> `req.params.productId` comes in as a **string**, so `Number()` converts it for comparison with the numeric `id` in data.

**URL example:** `GET /api/products/3` → returns product with id 3

---

## 10. Nested Route Parameters

You can have **multiple params** in one route:

```js
app.get('/api/products/:productId/reviews/:reviewId', (req, res) => {
    console.log(req.params);
    // { productId: '2', reviewId: '5' }
    res.send("<h1>Hello World</h1>");
});
```

**URL example:** `GET /api/products/2/reviews/5`  
`req.params` → `{ productId: '2', reviewId: '5' }`

---

## 11. Query Strings

Query strings come after `?` in a URL and are accessed via `req.query`.

```
/api/v1/query?search=sofa&limit=3
```

```js
const { search, limit } = req.query;
// search = "sofa", limit = "3"
```

**Your code:**
```js
app.get("/api/v1/query", (req, res) => {
    const { search, limit } = req.query;
    // ...
});
```

> Query params are always **strings**. Convert with `Number(limit)` if needed.

---

## 12. Filtering & Limiting Data

**Your code shows a clean pattern:**

```js
let sortedProducts = [...product]; // copy the array — don't mutate original

if (search) {
    sortedProducts = sortedProducts.filter((p) =>
        p.name.toLowerCase().startsWith(search.toLowerCase())
    );
}

if (limit) {
    sortedProducts = sortedProducts.slice(0, Number(limit));
}

if (sortedProducts.length < 1) {
    return res.status(200).send("<h1>No Products Matched</h1>");
}

res.json(sortedProducts);
```

| Method | Purpose |
|--------|---------|
| `[...product]` | Spread — shallow copy of array |
| `.filter()` | Returns items matching condition |
| `.startsWith()` | Checks beginning of string |
| `.slice(0, n)` | Returns first `n` items |

---

## 13. Separating Data (Mock DB)

Instead of writing data inside route files, you moved it to `data.js`:

```js
// data.js
const product = [ /* ... */ ];
const people  = [ /* ... */ ];

module.exports = { product, people };
```

Then import in `products-api.js`:
```js
const { product } = require("./data.js");
```

> This is the **separation of concerns** pattern — keep data, logic, and routes in different files.  
> `people` is exported but not yet used — saved for a future exercise.

---

## 14. Module Exports & Require

| Syntax | Usage |
|--------|-------|
| `module.exports = value` | Export a single thing |
| `module.exports = { a, b }` | Export multiple things (named) |
| `const x = require('./file')` | Import a single export |
| `const { a, b } = require('./file')` | Destructure named exports |

---

## 15. Key Concepts Cheatsheet

```
app.get(path, handler)          → Handle GET request
app.use(handler)                → Middleware / catch-all

req.params.name                 → Route parameter (:name)
req.query.name                  → Query string (?name=value)
req.body                        → Request body (needs middleware)

res.send(html)                  → Send HTML string
res.json(object)                → Send JSON
res.sendFile(absolutePath)      → Send a file
res.status(code).send(msg)      → Send with status code

express.static(folder)         → Serve static files from folder
path.resolve(__dirname, path)  → Build safe absolute path
```

---

## 🗂️ Files in Your Project

| File | Concept Covered |
|------|----------------|
| `basic-routing.js` | Routes, `res.send()`, status codes, 404 handler |
| `static-files.js` | Static files, `res.sendFile()`, `path` module |
| `products-api.js` | REST API, route params, query strings, filtering |
| `data.js` | Mock database, `module.exports` |
| `app/index.html` | Served by `static-files.js` via `res.sendFile()` |
| `public/some.txt` | Served automatically by `express.static()` |

---

> 💡 **Tip for revision:** Go through each section, close the file, and try writing the code from memory. Then come back and check.