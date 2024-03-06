const { request } = require("express");
const Product = require("../models/productModel.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");
const slugify = require("slugify");

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
        const allProducts = await Product.find()

        if (!allProducts) {
            throw new ApiError(404, "No products found in database.")
        };

        return res.status(200).json(new ApiResponse(200, allProducts, "These are all available products"));

    } catch (error) {
        throw new ApiError(500, error?.message || "An error occurred when fetching all products.")
    }
})

const updateProduct = asyncHandeler(async (req, res) => {
    const { _id } = req.params

    if (req.body.title) {
        req.body.slug = slugify(req.body.title)
    }

    const productDetails = await Product.findByIdAndUpdate(
        _id,
        req.body,
        { new: true }
    )

    return res.status(200)
        .json(new ApiResponse(200, productDetails, "Product details updated successfully"))

})




module.exports = { createProduct, getCurrentProduct, getAllProducts, updateProduct }