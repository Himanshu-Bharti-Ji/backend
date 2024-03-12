const User = require("../models/userModel.js");
const Blog = require("../models/blogModel.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");


const createBlog = asyncHandeler(async (req, res) => {
    try {
        newBlog = await Blog.create(req.body);

        if (!newBlog) {
            throw new ApiError(401, "Something went wrong while creating a blog!")
        }

        return res.status(201)
            .json(new ApiResponse(200, newBlog, 'Blog Created Successfully'));


    } catch (error) {
        throw new ApiError(400, error?.message || "Some Error Occured!");
    }
})

const updateBlog = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)

    let updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBlog) {
        throw new ApiError(404, "No Blog Found With Given Id");
    }

    return res.json(new ApiResponse(200, updatedBlog, "Blog Updated Successfully"));
})

const getCurrentBlog = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)

    const blog = await Blog.findById(id)

    if (!blog) {
        throw new ApiError(404, "No Blog Found with given ID");
    }

    const updateViews = await Blog.findByIdAndUpdate(
        id,
        {
            $inc: { numViews: 1 },
        },
        { new: true } //return the new data after updating it
    ).select("-__v")

    return res.status(200)
        .json(new ApiResponse(
            200,
            updateViews,
            "Blog Details Retrieved Successfully"
        ));
})

const getAllBlogs = asyncHandeler(async (req, res) => {
    try {
        const allBlogs = await Blog.find().select("-__v")
        return res.json(new ApiResponse(200, allBlogs, 'all blogs retrieved successfully'));
    } catch (error) {
        throw new ApiError(500, error?.message || "Server Error , Could not fetch Blogs");
    }
})

const deleteCurrentBlog = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)

    try {
        const deletedBlog = await Blog.findByIdAndDelete(id).select("-__v");

        if (!deletedBlog) {
            throw new ApiError(404, "No Blog found with this Id");
        }

        return res.status(200)
            .json(new ApiResponse(200, deletedBlog, "Blog has been Deleted"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Server Error ,Could Not Delete The Blog");
    }
})

// const likeBlog = asyncHandeler(async (req, res) => {
//     const { blogId } = req.body;
//     validateMongoDbId(blogId)

//     const blog = await Blog.findById(blogId)

//     //checking if the user already liked the post or not
//     if (blog.likes.includes(req.user._id)) {
//         return res.status(400).json('You have already Liked This Post')
//     }
// })

module.exports = {
    createBlog,
    updateBlog,
    getCurrentBlog,
    getAllBlogs,
    deleteCurrentBlog
}