const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require("fs");

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ".jpeg")
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb({
            message: "Unsupported file formate",
        },
            false
        );
    }
}

const uploadImage = multer(
    {
        storage: multerStorage,
        fileFilter: multerFilter,
        limits: { fileSize: 2000000 }, // Max size is set to 2MB (2048 KB)
    }
)

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300)   //   Resizes the image to 50x50 pixels
            .toFormat("jpeg")     // Converts to jpeg format
            .jpeg({ quality: 90 })// Specifies the JPEG quality of the output file (from 1 to 100)
            .toFile(`public/images/products/${file.filename}`);
        fs.unlinkSync(`public/images/products/${file.filename}`);
    }));
    next();
}


const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300)   //   Resizes the image to 50x50 pixels
            .toFormat("jpeg")     // Converts to jpeg format
            .jpeg({ quality: 90 })// Specifies the JPEG quality of the output file (from 1 to 100)
            .toFile(`public/images/blogs/${file.filename}`);
        fs.unlinkSync(`public/images/blogs/${file.filename}`);
    }));
    next();
}


module.exports = { uploadImage, productImgResize, blogImgResize }