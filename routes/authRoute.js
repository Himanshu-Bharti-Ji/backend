const express = require("express");
const { registerUser, loginUser, getAllUsers, getCurrentUser, deleteCurrentUser, updateUserDetails, blockUser, unBlockUser, logoutUser, refreshAccessToken } = require("../controller/userController.js");
const { verifyJWT, isAdmin } = require("../middlewares/authMiddleware.js");
const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/all-users", getAllUsers);
router.get("/:id", verifyJWT, isAdmin, getCurrentUser);
router.delete("/:id", deleteCurrentUser);
router.put("/update-account", verifyJWT, updateUserDetails)
router.put("/block-account/:id", verifyJWT, isAdmin, blockUser)
router.put("/unblock-account/:id", verifyJWT, isAdmin, unBlockUser)
router.post("/logout", verifyJWT, logoutUser);


module.exports = router;