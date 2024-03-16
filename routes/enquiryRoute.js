const express = require("express");
const { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getAllEnquirys } = require("../controller/enquiryController.js");
const { verifyJWT, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/", verifyJWT, createEnquiry)
router.get("/all-enquiries", getAllEnquirys)
router.put("/:id", verifyJWT, updateEnquiry)
router.delete("/:id", verifyJWT, deleteEnquiry)
router.get("/:id", getEnquiry)

module.exports = router;