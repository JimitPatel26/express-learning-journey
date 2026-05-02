# 📁 03 — Products API

> **Concept:** Building a real REST API with route parameters, nested params, query strings, and data filtering.

---

## 📌 What You Learn Here

- Sending JSON with `res.json()`
- Route parameters with `req.params`
- Nested route parameters
- Query strings with `req.query`
- Filtering and limiting data
- Separating data into its own file (`data.js`)
- `module.exports` and `require()`

---

## 🚀 Run This

```bash
node index.js
# Server at http://localhost:5000
```

| URL | Response |
|-----|----------|
| `http://localhost:5000/` | Home page with products link |
| `http://localhost:5000/api/products` | All products (id, name, image, price) |
| `http://localhost:5000/api/products/1` | Single product by ID |
| `http://localhost:5000/api/products/99` | 404 — Product Does not Exist |
| `http://localhost:5000/api/products/1/reviews/3` | Nested params demo |
| `http://localhost:5000/api/v1/query?search=sofa` | Filter by name |
| `http://localhost:5000/api/v1/query?limit=3` | Limit to 3 results |
| `http://localhost:5000/api/v1/query?search=blue&limit=2` | Both together |

---

## 📂 Folder Structure

```
03-products-api/
├── index.js
└── data.js     ← mock database (products + people arrays)
```

---

## 🧠 Core Concepts

### 1. res.json() — Send JSON

```js
res.json({ id: 1, name: "sofa" });
```

- Automatically sets `Content-Type: application/json` header
- Serializes the object to a JSON string

> `res.send()` for HTML. `res.json()` for data/APIs. Remember this difference.

---

### 2. Field Filtering with map()

```js
app.get('/api/products', (req, res) => {
    const newProducts = product.map((p) => {
        const { id, name, image, price } = p; // desc excluded
        return { id, name, image, price };
    });
    res.json(newProducts);
});
```

- `desc` field is intentionally hidden from the API response
- Common REST pattern — only expose what the client needs
- Similar to `SELECT id, name, price FROM products` in SQL

---

### 3. Route Parameters — req.params

```js
app.get("/api/products/:productId", (req, res) => {
    const id = Number(req.params.productId);
});
```

- `:productId` is a named dynamic segment in the URL
- Accessed via `req.params.productId`
- ⚠️ Always a **string** — use `Number()` to compare with numeric IDs

```
URL: /api/products/3
req.params → { productId: "3" }  ← string, not number!
```

**Finding by ID:**
```js
const singleProduct = product.find(p => p.id === Number(req.params.productId));

if (!singleProduct) {
    return res.status(404).send("Product Does not Exist");
}

res.json(singleProduct);
```

> `return` before `res.status(404)` is important — it stops the function so `res.json()` below doesn't also run.

---

### 4. Nested Route Parameters

```js
app.get('/api/products/:productId/reviews/:reviewId', (req, res) => {
    console.log(req.params);
    // { productId: '2', reviewId: '5' }
});
```

```
URL: /api/products/2/reviews/5
req.params → { productId: "2", reviewId: "5" }
```

> Multiple `:params` in one route — all available in `req.params`.

---

### 5. Query Strings — req.query

Query strings come after `?` in a URL:

```
/api/v1/query?search=sofa&limit=3
               ↑ key=value pairs separated by &
```

```js
const { search, limit } = req.query;
// search = "sofa"   (string)
// limit  = "3"      (string)
```

> Query params are always **strings**. Convert with `Number()` when needed.

---

### 6. Filtering & Limiting Data

```js
let sortedProducts = [...product]; // ← shallow copy, never mutate original

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
| `[...product]` | Spread — shallow copy, protects original |
| `.filter()` | Returns only items matching condition |
| `.toLowerCase()` | Case-insensitive comparison |
| `.startsWith()` | Matches from beginning of string |
| `.slice(0, n)` | Returns first `n` items |

> If neither `search` nor `limit` is passed, both `if` blocks are skipped and all products are returned.

---

### 7. Separating Data — data.js

Instead of hardcoding data in the route file:

```js
// data.js
const product = [ /* array of products */ ];
const people  = [ /* array of people */ ];

module.exports = { product, people };
```

```js
// index.js
const { product } = require("./data.js");
```

> This is **separation of concerns** — data lives in one place, routes in another.

---

### 8. module.exports & require()

```js
// Exporting
module.exports = { product, people };   // named exports

// Importing
const { product } = require("./data.js");  // destructure what you need
```

| Syntax | Use |
|--------|-----|
| `module.exports = { a, b }` | Export multiple things |
| `const { a } = require('./file')` | Import only what you need |

---

## 💻 Full Code Summary

```js
const express = require("express");
const app = express();
const { product } = require("./data.js");

// All products — filtered fields
app.get('/api/products', (req, res) => {
    const newProducts = product.map(({ id, name, image, price }) =>
        ({ id, name, image, price })
    );
    res.json(newProducts);
});

// Single product by ID
app.get("/api/products/:productId", (req, res) => {
    const item = product.find(p => p.id === Number(req.params.productId));
    if (!item) return res.status(404).send("Product Does not Exist");
    res.json(item);
});

// Nested params
app.get('/api/products/:productId/reviews/:reviewId', (req, res) => {
    console.log(req.params);
    res.send("<h1>Hello World</h1>");
});

// Query string filtering
app.get("/api/v1/query", (req, res) => {
    const { search, limit } = req.query;
    let result = [...product];
    if (search) result = result.filter(p => p.name.toLowerCase().startsWith(search.toLowerCase()));
    if (limit)  result = result.slice(0, Number(limit));
    if (result.length < 1) return res.status(200).send("<h1>No Products Matched</h1>");
    res.json(result);
});

app.listen(5000, () => console.log("http://localhost:5000"));
```

---

## ❓ Revision Questions

1. What is the difference between `req.params` and `req.query`?
2. Why do you need `Number(req.params.productId)`?
3. Why use `[...product]` instead of directly using `product`?
4. What happens if no query params are passed to `/api/v1/query`?
5. Why use `return` before `res.status(404)`?
6. What does `module.exports` do?

---

> 💡 **Tip:** Route params (`:id`) are for identifying a specific resource. Query strings (`?search=`) are for filtering, sorting, or paginating a list.