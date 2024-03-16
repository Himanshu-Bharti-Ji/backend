const Color = require("../models/colorModel.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");



const createColor = asyncHandeler(async (req, res) => {
    try {
        const newColor = await Color.create(req.body);

        return res.status(201)
            .json(new ApiResponse(201, newColor, "Color Created Successfully"));

    } catch (error) {
        throw new ApiError(400, error?.message || "Something went wrong while creating Color!");
    }
})

const updateColor = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const updateColor = await Color.findByIdAndUpdate(
            id,
            req.body,
            { new: true } //return updated document
        )

        return res.status(200)
            .json(new ApiResponse(200, updateColor, 'Color Updated'));
    } catch (error) {
        throw new ApiError(404, error?.message || `Color with the id of ${id} not found!`);
    }
})

const deleteColor = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedColor = await Color.findByIdAndDelete(id);

        return res.status(200)
            .json(new ApiResponse(200, deletedColor, 'Color Deleted Successfully'));
    } catch (error) {
        throw new ApiError(404, error?.message || `Color with the id of ${id} not found!`);
    }
})

const getColor = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    const color = await Color.findById(id).select('-__v');

    if (!Color) {
        throw new ApiError(404, "This Color Doesn't Exist!");
    }

    return res.status(200).json(new ApiResponse(200, color, "Color Retrieved"));

})

const getAllColors = asyncHandeler(async (req, res) => {
    try {
        const allColors = await Color.find().select("-__v")
        return res.json(new ApiResponse(200, allColors, 'all Colors retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, error?.message || "Server Error , Could not fetch Colors");
    }
})

module.exports = {
    createColor,
    updateColor,
    deleteColor,
    getColor,
    getAllColors
}