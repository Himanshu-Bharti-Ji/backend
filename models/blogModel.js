const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisiked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    images: [],
    author: {
        type: String,
        default: "Admin"
    }
},
    {
        toJSON: { virtuals: true }, // So that the `image` field appears in JSON responses.
        toObject: { virtuals: true }, //   So that the `image` field appears in MongoDB queries.
        timestamps: true //  Saves createdAt and updatedAt fields automatically.
    }
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);