const express = require("express");
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrands } = require("../controller/brandController.js");
const { verifyJWT, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", verifyJWT, isAdmin, createBrand)
router.get("/all-brands", getAllBrands)
router.put("/:id", verifyJWT, isAdmin, updateBrand)
router.delete("/:id", verifyJWT, isAdmin, deleteBrand)
router.get("/:id", getBrand)

module.exports = router;