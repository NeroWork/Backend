const { EErrors } = require("../utils/customError");

const errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case EErrors.INVALID_PARAMS:
            res.send({status: "error handler", error: error.name});
            break;
        case EErrors.ROUTING_ERROR:
            res.send({status: "error handler", error: error.name});
            break;
        case EErrors.DATABASE_ERROR:
            res.send({status: "error handler", error: error.name});
            break;
        default:
            res.send({status: "error handler", error: "Unhandled error"})
            break;
    }
}

module.exports = {errorHandler};