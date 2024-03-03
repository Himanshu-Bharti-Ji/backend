const mongoose = require("mongoose");
const ApiError = require("./ApiError");

const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
        throw new ApiError(404, "This is not valid or Not found")
    }
}

module.exports = validateMongoDbId;