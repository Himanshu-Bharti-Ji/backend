const User = require("../models/userModel.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");
const validateMongoDbId = require("../utils/validateMongodbId.js");

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandeler(async (req, res) => {

    // 1. get user details from frontend
    const { firstName, lastName, email, password, role, cart, address, wishlist } = req.body

    // 2. validation - not empty
    if (
        [firstName, email, password, role, cart, address, wishlist].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Some fields are required")
    }

    // 3. check if user already exist: email
    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User with this email already exist")
    }

    // 4. create user object - create entry in db
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
        cart,
        address,
        wishlist
    })

    // 5. remove password field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    // 6. check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // 7. return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandeler(async (req, res) => {

    // 1. req body -> data (request body se data le aao)
    const { email, password } = req.body

    // 2. validation - not empty
    if (!(email || password)) {
        throw ApiError(400, "username and password is required")
    }

    // 3. find the user
    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    // 4. password check
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    // 5. generate token

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        ))

})

const logoutUser = asyncHandeler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out successfully"))
})

const getAllUsers = asyncHandeler(async (req, res) => {
    try {
        const allUsers = await User.find().select("-password")
        return res.status(200)
            .json(new ApiResponse(
                200,
                allUsers,
                "Users fetched successfully"
            ))
    } catch (error) {
        throw new ApiError(500, "Server error while fetching users")
    }
})

const getCurrentUser = asyncHandeler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)

    try {
        const currentUser = await User.findById(_id).select("-password")

        if (!currentUser) {
            // If currentUser is null, the user doesn't exist
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        return res.status(200)
            .json(new ApiResponse(
                200,
                currentUser,
                "User fetched successfully"
            ))
    } catch (error) {
        throw new ApiError(500, "Server error while fetching the user")
    }
})

const updateUserDetails = asyncHandeler(async (req, res) => {
    // console.log(req.user)
    const { firstName, lastName, email } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        // console.log(res.user._id)
        const userDetails = await User.findByIdAndUpdate(
            _id,
            {
                $set: {
                    firstName,
                    lastName,
                    email
                }
            },
            { new: true }
        ).select("-password")
        // console.log(userDetails)

        return res.status(200)
            .json(new ApiResponse(200, userDetails, "Account details updated successfullly"))
    } catch (error) {
        throw new ApiError(500, "Error while updating the user")
    }
})

const deleteCurrentUser = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const currentUser = await User.findByIdAndDelete(id).select("-password")

        if (!currentUser) {
            // If currentUser is null, the user doesn't exist
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        return res.status(200)
            .json(new ApiResponse(
                200,
                currentUser,
                "User deleted successfully"
            ))
    } catch (error) {
        throw new ApiError(500, "Server error while deleting the user")
    }
})

const blockUser = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)

    try {
        const blockUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    isBlocked: true
                }
            },
            { new: true }
        )

        if (!blockUser) {
            throw new ApiError(404, "user does not exist")
        }

        return res.status(200)
            .json(new ApiResponse(200, {}, "user blocked successfully"))

    } catch (error) {
        throw new ApiError(404, "error while blocking the user")
    }

})

const unBlockUser = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)

    try {
        const unBlockUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    isBlocked: false
                }
            },
            { new: true }
        )

        if (!unBlockUser) {
            throw new ApiError(404, "user does not exist")
        }

        return res.status(200)
            .json(new ApiResponse(200, {}, "user unblocked successfully"))

    } catch (error) {
        throw new ApiError(404, "error while unblocking the user")
    }
})

module.exports = { registerUser, loginUser, getAllUsers, getCurrentUser, deleteCurrentUser, updateUserDetails, blockUser, unBlockUser, logoutUser }