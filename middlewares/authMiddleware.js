const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { asyncHandeler } = require("../utils/asyncHandeler");
const User = require("../models/userModel.js");


const verifyJWT = asyncHandeler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECERET)
        // console.log(decodedToken)

        const user = await User.findById(decodedToken?._id).select("-password")
        // console.log(user);

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})

const isAdmin = asyncHandeler(async (req, res, next) => {
    // console.log(req.user)
    const { email } = req.user;

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(401, "user does not exist")
    }
    // console.log(user.role)

    if (user.role !== "admin") {
        throw new ApiError(402, "you are not an admin")
    }

    next();

})

module.exports = { verifyJWT, isAdmin }