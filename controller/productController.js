const { request, query } = require("express");
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
        console.log(page, limit, skip);

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
        console.log(req.body.slug);
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




module.exports = { createProduct, getCurrentProduct, getAllProducts, updateProduct, deleteProduct }