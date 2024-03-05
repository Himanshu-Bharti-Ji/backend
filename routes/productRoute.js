const express = require("express");
const { createProduct, getCurrentProduct, getAllProducts } = require("../controller/productController.js");
const router = express.Router();

router.post("/", createProduct);
router.get("/all-products", getAllProducts);
router.get("/:id", getCurrentProduct);

module.exports = router;