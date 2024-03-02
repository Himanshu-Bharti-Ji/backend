const { log } = require("console");
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use("/", (req, res) => {
    res.send("Hello from Hi Tech Himanshu's Server")
})

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})