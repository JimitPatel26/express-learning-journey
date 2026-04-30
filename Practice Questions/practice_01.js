// Write an Express route that listens on GET /users/:id and returns a JSON object with the id and a message.

const express = require("express")
const app = express()

app.get("/",(req,res)=>{
    res.send("<h1>Home Page</h1>");
})

app.get('/users/:id',(req,res)=>{
    const id = req.params.id;
    res.send(id);
})

app.listen(3120,()=>{
    console.log("http://localhost:3120");
})