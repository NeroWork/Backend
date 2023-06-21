class CustomError {
    static createError({name = "Error", cause, message, code = 1}) {
        const error = new Error(message);
        error.name = name;
        error.code = code;
        error.cause = cause;
        throw error;
    }
}

const EErrors = {
    ROUTING_ERROR: 1,
    INVALID_PARAMS: 2,
    DATABASE_ERROR: 3
}

const generateInvalidParamInfo = (param) => {
    return `One or more praram were incomplete or not valid:
    --------
     ${param} was a ${typeof(param)}
    --------
    `
}

module.exports = {
    CustomError,
    EErrors,
    generateInvalidParamInfo
}