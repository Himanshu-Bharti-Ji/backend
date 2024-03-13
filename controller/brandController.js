const Brand = require("../models/brandModel.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");



const createBrand = asyncHandeler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);

        return res.status(201)
            .json(new ApiResponse(201, newBrand, "Brand Created Successfully"));

    } catch (error) {
        throw new ApiError(400, error?.message || "Something went wrong while creating Brand!");
    }
})

const updateBrand = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const updateBrand = await Brand.findByIdAndUpdate(
            id,
            req.body,
            { new: true } //return updated document
        )

        return res.status(200)
            .json(new ApiResponse(200, updateBrand, 'Brand Updated'));
    } catch (error) {
        throw new ApiError(404, error?.message || `Brand with the id of ${id} not found!`);
    }
})

const deleteBrand = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);

        return res.status(200)
            .json(new ApiResponse(200, deletedBrand, 'Brand Deleted Successfully'));
    } catch (error) {
        throw new ApiError(404, error?.message || `Brand with the id of ${id} not found!`);
    }
})

const getBrand = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    const brand = await Brand.findById(id).select('-__v');

    if (!Brand) {
        throw new ApiError(404, "This Brand Doesn't Exist!");
    }

    return res.status(200).json(new ApiResponse(200, brand, "Brand Retrieved"));

})

const getAllBrands = asyncHandeler(async (req, res) => {
    try {
        const allBrands = await Brand.find().select("-__v")
        return res.json(new ApiResponse(200, allBrands, 'all Brands retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, error?.message || "Server Error , Could not fetch Brands");
    }
})

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrands
}