const express = require("express");
const { createColor, updateColor, deleteColor, getColor, getAllColors } = require("../controller/colorController.js");
const { verifyJWT, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", verifyJWT, isAdmin, createColor)
router.get("/all-colors", getAllColors)
router.put("/:id", verifyJWT, isAdmin, updateColor)
router.delete("/:id", verifyJWT, isAdmin, deleteColor)
router.get("/:id", getColor)

module.exports = router;