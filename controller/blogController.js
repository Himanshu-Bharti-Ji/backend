const User = require("../models/userModel.js");
const Blog = require("../models/blogModel.js");
const { asyncHandeler } = require("../utils/asyncHandeler.js");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const fs = require("fs");



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
        .populate("likes")
        .populate("dislikes");

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
            blog,
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

const likeBlog = asyncHandeler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId)

    //  find the blog which you want to like
    const blog = await Blog.findById(blogId)

    // find  the user who is making a request
    const loginUserId = req.user?._id;

    // check whether the user already liked or not
    const isLiked = blog?.isLiked;

    // check whether the user disliked or not
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisiked: false
            },
            { new: true }
        );
        return res.status(201).json(new ApiResponse(201, blog, 'You have undone your Dislike'));
    }

    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false
            },
            { new: true }
        );
        return res.status(201).json(new ApiResponse(201, blog, "You don't Like this blog anymore"));
    } else {
        // add the user id in the array of users who has liked it
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
                isLiked: true
            },
            { new: true }
        );
        return res.status(201).json(new ApiResponse(201, blog, "You like this blog now!"));

    }


})

const dislikeBlog = asyncHandeler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId)

    //  find the blog which you want to dislike
    const blog = await Blog.findById(blogId)

    // find  the user who is making a request
    const loginUserId = req.user?._id;

    // check whether the user already disliked or not
    const isDisliked = blog?.isDisiked;

    // check whether the user liked or not
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );

    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false
            },
            { new: true }
        );
        return res.status(201).json(new ApiResponse(201, blog, 'You have undone your like'));
    }

    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisiked: false
            },
            { new: true }
        );
        return res.status(201).json(new ApiResponse(201, blog, "You don't dislike this blog anymore"));
    } else {
        // add the user id in the array of users who has liked it
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId },
                isDisiked: true
            },
            { new: true }
        );
        return res.status(201).json(new ApiResponse(201, blog, "You dislike this blog now!"));

    }

})

const uploadImages = asyncHandeler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    // console.log(req.files);

    try {
        const uploader = (path) => uploadOnCloudinary(path, "images");
        const urls = [];
        const files = req.files;
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

        const findBlog = await Blog.findByIdAndUpdate(
            id,
            { images: urls.map(file => { return file }) },
            { new: true }
        )

        return res.status(200)
            .json(new ApiResponse(
                200,
                findBlog,
                `Image uploaded successfully`
            ))

    } catch (error) {
        throw new ApiError(400, error?.message || "Error in uploading image")
    }
})

module.exports = {
    createBlog,
    updateBlog,
    getCurrentBlog,
    getAllBlogs,
    deleteCurrentBlog,
    likeBlog,
    dislikeBlog,
    uploadImages
}