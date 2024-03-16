const { request, query } = require("express");
const Product = require("../models/productModel.js");
const User = require("../models/userModel.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const fs = require("fs");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary.js")

const createProduct = asyncHandeler(async (req, res) => {

    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }

    const newProduct = await Product.create(req.body);

    if (!newProduct) {
        throw new ApiError(404, "Failed to add product!");
    }

    res.status(200)
        .json(
            new ApiResponse(200, newProduct, "Successfully added a new product!")
        )
})

const getCurrentProduct = asyncHandeler(async (req, res) => {
    // console.log(req.params);
    const { id } = req.params;
    // console.log(id);

    try {
        const currentProduct = await Product.findById(id);

        if (!currentProduct) {
            throw new ApiError(404, `The product with the id: "${id}" doesn't exist.`);
        }
        return res.status(200).json(new ApiResponse(200, currentProduct, 'This is the requested product'));
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while getting the product data.");
    }
})

const getAllProducts = asyncHandeler(async (req, res) => {
    try {

        // Filtering
        const queryObj = { ...req.query };
        // console.log(queryObj)
        const excludeFields = ["page", "sort", "limit", "fields"];
        // console.log(queryObj)
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        // console.log(queryStr)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // console.log(queryStr)

        let query = Product.find(JSON.parse(queryStr))


        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ")
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt")
        }


        // Limiting the fields 
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }
        // Pagination
        const page = parseInt(req.query.page ? req.query.page : 1);
        const limit = parseInt(req.query.limit ? req.query.limit : 6);
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        // console.log(page, limit, skip);

        if (req.query.page) {
            const totalPages = await Product.countDocuments();
            if (skip >= totalPages) {
                throw new ApiError(404, "Page not found")

            }
        }

        const allProducts = await query
        // console.log(allProducts)

        if (!allProducts) {
            throw new ApiError(404, "No products found in database.")
        };

        return res.status(200).json(new ApiResponse(200, allProducts, "These are all available products"));

    } catch (error) {
        throw new ApiError(500, error?.message || "An error occurred when fetching all products.")
    }
})

const updateProduct = asyncHandeler(async (req, res) => {
    const { id } = req.params
    // console.log(id)
    // console.log(req.body.title)

    if (req.body.title) {
        req.body.slug = slugify(req.body.title)
        // console.log(req.body.slug);
    }

    // console.log(req.body);

    const productDetails = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    )

    return res.status(200)
        .json(new ApiResponse(200, productDetails, "Product details updated successfully"))

})

const deleteProduct = asyncHandeler(async (req, res) => {
    const { id } = req.params;

    const deleteProduct = await Product.findByIdAndDelete(id)

    return res.status(200).json(
        new ApiResponse(200, deleteProduct, 'This product has been deleted')
    )

})

const addToWishlist = asyncHandeler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;
    // console.log(_id, productId);


    // if (!user) {
    //     throw new ApiError(401, 'User Not Found')
    // }

    // console.log(user);

    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === productId);

        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: productId }
                },
                { new: true }
            )
            return res.status(200)
                .json(new ApiResponse(200, user, "Product Removed From WishList"))
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: productId }
                },
                { new: true }
            )
            return res.status(200)
                .json(new ApiResponse(200, user, "Product Added To WishList"))
        }
    } catch (error) {
        throw new ApiError(500, error?.message || 'Server Error');
    }

})

const ratings = asyncHandeler(async (req, res) => {
    const { _id } = req.user;
    const { star, productId, comment } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product Not Found");
    }

    // Checking If The User Has Already Rated This Product
    const alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString());

    if (alreadyRated) {
        const updateRatings = await Product.updateOne(
            {
                ratings: { $elemMatch: alreadyRated }
            },
            {
                $set: { "ratings.$.star": star, "ratings.$.comment": comment }
            },
            { new: true }
        )

        // return res.status(201)
        //     .json(new ApiResponse(
        //         201,
        //         updateRatings,
        //         "Your rating has been updated"
        //     ))
    } else {
        //   Push the rating to users ratings list 
        const rateProduct = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedBy: _id,
                    }
                }
            },
            { new: true }
        )

        // return res.status(201)
        //     .json(new ApiResponse(
        //         201,
        //         rateProduct,
        //         "You have rated this product successfully!"
        //     ))
    }

    const getAllRatings = await Product.findById(productId);
    let totalRatings = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
        .map(rating => rating.star)
        .reduce((prevValue, currValue) => prevValue + currValue, 0)

    let avgRating = Math.round(ratingSum / totalRatings);
    // Update the average rating in the database
    const finalProduct = await Product.findByIdAndUpdate(
        productId,
        { totalRatings: avgRating },
        { new: true }
    )


    return res.status(201)
        .json(new ApiResponse(
            201,
            finalProduct,
            'Your ratings has been added to our records.'

        ))
})

const uploadImages = asyncHandeler(async (req, res) => {
    try {
        // console.log("req.files", req.files);
        // const files = req.files;
        // if (!Array.isArray(files)) {
        //     throw new ApiError(400, "No files uploaded");
        // }

        const uploader = (path) => uploadOnCloudinary(path, "images");
        const urls = [];
        const files = req.files;
        // console.log("Files", files);
        for (const file of files) {
            const { path } = file;
            const cloudUrl = await uploader(path);
            urls.push(cloudUrl);
            try {
                fs.unlinkSync(path);
            } catch (error) {
                console.error(`Error unlinking file: ${error.message}`);
            }
        }

        // console.log(urls);
        const images = urls.map((file) => {
            return file;
        })

        return res.status(200)
            .json(new ApiResponse(
                200,
                images,
                `Image uploaded successfully`
            ))

    } catch (error) {
        throw new ApiError(400, error?.message || "Error in uploading image")
    }
})

const deleteImages = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await deleteFromCloudinary(id, "image");

        return res.status(200)
            .json(new ApiResponse(
                200,
                deleted,
                `Image deleted successfully`
            ))

    } catch (error) {
        throw new ApiError(400, error?.message || "Error in deleting image")
    }
})




module.exports = {
    createProduct,
    getCurrentProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishlist,
    ratings,
    uploadImages,
    deleteImages
}