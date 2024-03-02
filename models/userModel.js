const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    }
});


// Encrypting Password
userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Matching Password

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Generating Token

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email
        },
        process.env.TOKEN_SECERET,
        {
            expiresIn: process.env.TOKEN_EXPIRY
        }
    )
}




//Export the model
module.exports = mongoose.model('User', userSchema);