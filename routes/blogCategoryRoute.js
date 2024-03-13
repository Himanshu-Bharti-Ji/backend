const express = require("express");
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories } = require("../controller/blogCategoryController.js");
const { verifyJWT, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", verifyJWT, isAdmin, createCategory)
router.get("/all-categories", getAllCategories)
router.put("/:id", verifyJWT, isAdmin, updateCategory)
router.delete("/:id", verifyJWT, isAdmin, deleteCategory)
router.get("/:id", getCategory)

module.exports = router;