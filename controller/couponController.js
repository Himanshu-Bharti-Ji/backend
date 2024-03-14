const Coupon = require("../models/couponModel.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");

const createCoupon = asyncHandeler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);

        return res.status(201)
            .json(new ApiResponse(201, newCoupon, "Coupon Created Successfully"));

    } catch (error) {
        throw new ApiError(400, error?.message || 'Something went wrong while creating the coupon');
    }
})

const getAllCoupons = asyncHandeler(async (req, res) => {
    try {
        const coupons = await Coupon.find();

        return res.status(200)
            .json(new ApiResponse(200, coupons, "Successfully Retrieved All Coupons"));

    } catch (error) {
        throw new ApiError(404, error?.message || "Failed to retrieve all coupons");
    }
})

const updateCoupon = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        return res.status(202)
            .json(new ApiResponse(202, updatedCoupon, "Coupon Updated Successfully"));

    } catch (error) {
        throw new ApiError(404, `The coupon with the id of ${id} could not be found`);
    }
})

const deleteCoupon = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);

        return res.status(202)
            .json(new ApiResponse(202, deletedCoupon, 'The coupon has been successfully removed from our server'));

    } catch (error) {
        throw new ApiError(400, error?.message || 'Could Not Delete The Coupon');
    }
})

module.exports = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
}