const express = require("express");
const dbConnect = require("./config/dbConnect.js");
const { error } = require("console");
const app = express();
const dotenv = require("dotenv").config({ path: ".env" });
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute.js");
const productRouter = require("./routes/productRoute.js");
const prodCategoryRouter = require("./routes/prodCategoryRoute.js");
const blogCategoryRouter = require("./routes/blogCategoryRoute.js");
const blogRouter = require("./routes/blogRoute.js");
const brandRouter = require("./routes/brandRoute.js");
const couponRouter = require("./routes/couponRoute.js");
const colorRouter = require("./routes/colorRoute.js");
const enquiryRouter = require("./routes/enquiryRoute.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");



// I add app.use and app.listen in try catch 
dbConnect()
    .then(() => {

        app.use(morgan("dev")); // log requests to the console

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }))

        app.use(cookieParser())


        app.use("/api/v1/user", authRouter)
        app.use("/api/v1/product", productRouter)
        app.use("/api/v1/blog", blogRouter)
        app.use("/api/v1/product-category", prodCategoryRouter)
        app.use("/api/v1/blog-category", blogCategoryRouter)
        app.use("/api/v1/brand", brandRouter)
        app.use("/api/v1/coupon", couponRouter)
        app.use("/api/v1/color", colorRouter)
        app.use("/api/v1/enquiry", enquiryRouter)


        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log("Mongo DB connection failed !!! ", error);
    })

