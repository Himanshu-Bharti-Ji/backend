const express = require("express");
const dbConnect = require("./config/dbConnect.js");
const { error } = require("console");
const app = express();
const dotenv = require("dotenv").config({ path: ".env" });
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute.js");
const productRouter = require("./routes/productRoute.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");



// I add app.use and app.listen in try catch 
dbConnect()
    .then(() => {

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }))

        app.use(cookieParser())


        app.use("/api/v1/user", authRouter)
        app.use("/api/v1/product", productRouter)


        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log("Mongo DB connection failed !!! ", error);
    })

