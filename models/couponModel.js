const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    expiry: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    }
}, { timestamps: true }); // Adds created_at and updated_at fields automatically

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);