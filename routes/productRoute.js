const express = require("express");
const { createProduct, getCurrentProduct, getAllProducts, updateProduct } = require("../controller/productController.js");
const router = express.Router();

router.post("/", createProduct);
router.get("/all-products", getAllProducts);
router.get("/:id", getCurrentProduct);
router.put("/:id", updateProduct);

module.exports = router;