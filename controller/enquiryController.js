const Enquiry = require("../models/enquiryModel.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");



const createEnquiry = asyncHandeler(async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);

        return res.status(201)
            .json(new ApiResponse(201, newEnquiry, "Enquiry Created Successfully"));

    } catch (error) {
        throw new ApiError(400, error?.message || "Something went wrong while creating Enquiry!");
    }
})

const updateEnquiry = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const updateEnquiry = await Enquiry.findByIdAndUpdate(
            id,
            req.body,
            { new: true } //return updated document
        )

        return res.status(200)
            .json(new ApiResponse(200, updateEnquiry, 'Enquiry Updated'));
    } catch (error) {
        throw new ApiError(404, error?.message || `Enquiry with the id of ${id} not found!`);
    }
})

const deleteEnquiry = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

        return res.status(200)
            .json(new ApiResponse(200, deletedEnquiry, 'Enquiry Deleted Successfully'));
    } catch (error) {
        throw new ApiError(404, error?.message || `Enquiry with the id of ${id} not found!`);
    }
})

const getEnquiry = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    const enquiry = await Enquiry.findById(id).select('-__v');

    if (!Enquiry) {
        throw new ApiError(404, "This Enquiry Doesn't Exist!");
    }

    return res.status(200).json(new ApiResponse(200, enquiry, "Enquiry Retrieved"));

})

const getAllEnquirys = asyncHandeler(async (req, res) => {
    try {
        const allEnquirys = await Enquiry.find().select("-__v")
        return res.json(new ApiResponse(200, allEnquirys, 'all Enquirys retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, error?.message || "Server Error , Could not fetch Enquirys");
    }
})

module.exports = {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getAllEnquirys
}