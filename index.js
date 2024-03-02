const express = require("express");
const dbConnect = require("./config/dbConnect.js");
const { error } = require("console");
const app = express();
const dotenv = require("dotenv").config({ path: ".env" });
const PORT = process.env.PORT || 4000;

// I add app.use and app.listen in try catch 
dbConnect()
.then(() => {
    app.use("/", (req, res) => {
        res.send("Hello from Hi Tech Himanshu's Server")
    })
    
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
    })
})
.catch((error) => {
    console.log("Mongo DB connection failed !!! ", error);
})

