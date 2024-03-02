class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        // stack -> it is an error stack
        stack = ""
    ) {
        // overwriting 
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
    }
}

module.exports = ApiError;