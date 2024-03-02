const User = require("../models/userModel.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");


const accessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const token = user.generateToken()
        return token;
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandeler(async (req, res) => {

    // 1. get user details from frontend
    const { firstName, lastName, email, password } = req.body

    // 2. validation - not empty
    if (
        [firstName, email, password].some((field) => field?.trim() === "")
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
        password
    })

    // 5. remove password field from response
    const createdUser = await User.findById(user._id).select("-password")

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

    const token = await accessToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")

    return res.status(200)
        .json(new ApiResponse(
            200,
            {
                user: loggedInUser, token
            },
            "User logged in successfully"
        ))

})

module.exports = { registerUser, loginUser }