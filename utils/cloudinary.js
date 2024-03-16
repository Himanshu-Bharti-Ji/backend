const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECERET
});


const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(localFilePath, { resource_type: "auto" }, (error, result) => {
            if (error) {
                // console.error("Error uploading file to Cloudinary:", error);
                reject(error);
            } else {
                // console.log("File uploaded successfully to Cloudinary:", result.secure_url);
                resolve(
                    {
                        url: result.secure_url,
                        asset_id: result.asset_id,
                        public_id: result.public_id
                    }
                );
            }
        });
    });

}


const deleteFromCloudinary = async (publicId, resourceType = 'image') => {

    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
            if (error) {
                // console.error("Error uploading file to Cloudinary:", error);
                reject(error);
            } else {
                // console.log("File uploaded successfully to Cloudinary:", result.secure_url);
                resolve(
                    {
                        url: result.secure_url,
                        asset_id: result.asset_id,
                        public_id: result.public_id
                    }
                );
            }
        });
    });

}


module.exports = { uploadOnCloudinary, deleteFromCloudinary };


