const asyncHandeler = (requestHandeler) => {
    return (req, res, next) => {
        // console.log(req, res, next);
        Promise.resolve(requestHandeler(req, res, next)).catch((err) => next(err))
    }
}

module.exports = { asyncHandeler }