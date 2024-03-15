const express = require("express");
const { verifyJWT, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog, updateBlog, getCurrentBlog, getAllBlogs, deleteCurrentBlog, likeBlog, dislikeBlog, uploadImages } = require("../controller/blogController");
const { uploadImage, blogImgResize } = require("../middlewares/multerMiddleware");
const router = express.Router();

router.post("/", verifyJWT, isAdmin, createBlog);
router.get("/all-blogs", getAllBlogs);
router.put("/likes", verifyJWT, likeBlog)
router.put("/dislikes", verifyJWT, dislikeBlog)

router.put("/upload/:id", verifyJWT, isAdmin, uploadImage.array("images", 2), blogImgResize, uploadImages)
router.put("/:id", verifyJWT, isAdmin, updateBlog);
router.get("/:id", getCurrentBlog);
router.delete("/:id", verifyJWT, isAdmin, deleteCurrentBlog);

module.exports = router;