const express = require("express");
const { registerUser,
    loginUser,
    getAllUsers,
    getCurrentUser,
    deleteCurrentUser,
    updateUserDetails,
    blockUser,
    unBlockUser,
    logoutUser,
    refreshAccessToken,
    updatePassword,
    forgotPasswordToken,
    loginAdmin,
    getWishlist,
    saveUserAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus
} = require("../controller/userController.js");
const { verifyJWT, isAdmin } = require("../middlewares/authMiddleware.js");

const router = express.Router();


router.post("/register", registerUser);
router.post("/forgot-password-token", forgotPasswordToken)
router.put("/update-password", verifyJWT, updatePassword)
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.post("/add-to-cart", verifyJWT, userCart);
router.post("/add-to-cart/applycoupon", verifyJWT, applyCoupon);
router.post("/add-to-cart/cash-order", verifyJWT, createOrder)
router.post("/refresh-token", refreshAccessToken);

router.get("/all-users", getAllUsers);
router.get("/wishlist", verifyJWT, getWishlist);
router.get("/get-cart", verifyJWT, getUserCart);
router.get("/get-orders", verifyJWT, getOrders);
router.get("/:id", verifyJWT, isAdmin, getCurrentUser);

router.delete("/empty-cart", verifyJWT, emptyCart);
router.delete("/:id", deleteCurrentUser);

router.put("/update-account", verifyJWT, updateUserDetails)
router.put("/save-address", verifyJWT, saveUserAddress)
router.put("/order/update-order/:id", verifyJWT, isAdmin, updateOrderStatus)
router.put("/block-account/:id", verifyJWT, isAdmin, blockUser)
router.put("/unblock-account/:id", verifyJWT, isAdmin, unBlockUser)
router.post("/logout", verifyJWT, logoutUser);


module.exports = router;