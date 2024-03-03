const express = require("express");
const { registerUser, loginUser, getAllUsers, getCurrentUser, deleteCurrentUser, updateUserDetails } = require("../controller/userController.js");
const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all-users", getAllUsers);
router.get("/:id", getCurrentUser);
router.delete("/:id", deleteCurrentUser);
router.put("/:id", updateUserDetails)

module.exports = router;