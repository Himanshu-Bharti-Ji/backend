const express = require("express");
const { createProduct, getCurrentProduct, getAllProducts, updateProduct, deleteProduct } = require("../controller/productController.js");
const { verifyJWT, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", verifyJWT, isAdmin, createProduct);
router.get("/all-products", getAllProducts);
router.get("/:id", getCurrentProduct);
router.put("/:id", verifyJWT, isAdmin, updateProduct);
router.delete("/:id", verifyJWT, isAdmin, deleteProduct);

module.exports = router;