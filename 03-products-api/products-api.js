const express = require("express");
const app = express();
const { product } = require("./data.js");

app.get("/", (req, res) => {
    res.send(`<h1>Home Page</h1><br>
        <a href="/api/products">Products</a>`);
});

app.get('/api/products', (req, res) => {
    const newProducts = product.map((p) => {
        const { id, name, image, price } = p;
        return { id, name, image, price };
    });
    res.json(newProducts);
});

app.get("/api/products/:productId", (req, res) => {
    const singleProduct = product.find((p) => {
        return p.id === Number(req.params.productId);
    });

    if (!singleProduct) {
        return res.status(404).send("Product Does not Exist");
    }

    res.json(singleProduct);
});

app.get('/api/products/:productId/reviews/:reviewId', (req, res) => {
    console.log(req.params);
    res.send("<h1>Hello World</h1>");
});

app.get("/api/v1/query", (req, res) => {
    const { search, limit } = req.query;
    let sortedProducts = [...product];

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
});

app.listen(5000, () => {
    console.log("http://localhost:5000");
});