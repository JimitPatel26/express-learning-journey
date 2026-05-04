// Create a basic web application that:
// • Displays a form on the homepage to enter a user's name
// • Sends the form data to the server using a get request
// • The server should read the submitted name from the query string
// • Finally, display a message confirming:

const express = require("express");
const app = express();
app.get("/", (req, res) => {
    res.send(`
        <h1>User Form</h1>
        <h3>Create User</h3>
        <form action="/user" method="get">
        <input type="text" name="name" placeholder="Enter name" />
        <button type="submit">Create</button>
        </form>
    `);
});

app.get("/user", (req, res) => {
    const name = req.query.name;
    res.send("User created with name " + name);
});

app.listen(5504, () => {
    console.log("Server started on port 5504");
});