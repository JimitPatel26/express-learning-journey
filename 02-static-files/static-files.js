const express = require("express")
const path = require('path')
const app = express()

// setup static and middleware
app.use(express.static('./public'))

app.get("/",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"./app/index.html"))
})

app.use((req,res)=>{
    res.status(404).send("Resources Not Found");
})

app.listen(3120,()=>{
    console.log("http://localhost:3120");
})
