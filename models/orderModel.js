const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            count: Number,
            color: String
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Pending",
        enum: [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Canceled",
            "Refunded",
            "On Hold",
            "Completed",
            "Failed",
        ],
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Order', orderSchema);