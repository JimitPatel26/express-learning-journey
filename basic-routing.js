const express = require("express");
const app = express();

app.get("/",(req,res)=>{
    res.send("<h1>Home Page</h1>");
})

app.get("/about",(req,res)=>{
    res.status(200).send("<h1>About Page</h1>");
})

app.use((req,res)=>{
    res.status(404).send("<h1>Page Not Found</h1>")
})

app.listen(3120,()=>{
    console.log("Server started at http://localhost:3120");
})