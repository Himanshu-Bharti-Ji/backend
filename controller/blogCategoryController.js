const BlogCategory = require("../models/blogCategoryModel.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");



const createCategory = asyncHandeler(async (req, res) => {
    try {
        const newCategory = await BlogCategory.create(req.body);

        return res.status(201)
            .json(new ApiResponse(201, newCategory, "Category Created Successfully"));

    } catch (error) {
        throw new ApiError(400, error?.message || "Something went wrong while creating category!");
    }
})

const updateCategory = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const updateCategory = await BlogCategory.findByIdAndUpdate(
            id,
            req.body,
            { new: true } //return updated document
        )

        return res.status(200)
            .json(new ApiResponse(200, updateCategory, 'Category Updated'));
    } catch (error) {
        throw new ApiError(404, error?.message || `category with the id of ${id} not found!`);
    }
})

const deleteCategory = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedCategory = await BlogCategory.findByIdAndDelete(id);

        return res.status(200)
            .json(new ApiResponse(200, deletedCategory, 'Category Deleted Successfully'));
    } catch (error) {
        throw new ApiError(404, error?.message || `category with the id of ${id} not found!`);
    }
})

const getCategory = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    const category = await BlogCategory.findById(id).select('-__v');

    if (!category) {
        throw new ApiError(404, "This Category Doesn't Exist!");
    }

    return res.status(200).json(new ApiResponse(200, category, "Category Retrieved"));

})

const getAllCategories = asyncHandeler(async (req, res) => {
    try {
        const allCategories = await BlogCategory.find().select("-__v")
        return res.json(new ApiResponse(200, allCategories, 'all categories retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, error?.message || "Server Error , Could not fetch Categories");
    }
})

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategories
}