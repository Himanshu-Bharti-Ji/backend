const express = require("express");
const { verifyJWT, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog, updateBlog, getCurrentBlog, getAllBlogs, deleteCurrentBlog } = require("../controller/blogController");
const router = express.Router();

router.post("/", verifyJWT, isAdmin, createBlog);
router.get("/all-blogs", getAllBlogs);
router.put("/:id", verifyJWT, isAdmin, updateBlog);
router.get("/:id", getCurrentBlog);
router.delete("/:id", verifyJWT, isAdmin, deleteCurrentBlog);

module.exports = router;