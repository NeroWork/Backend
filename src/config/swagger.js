const { dirname } = require("path");

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Coder Page Documentation",
            description: "Api created to practice back end"
        }
    },
    apis: [`${dirname(__dirname)}/docs/**/*.yaml`]
}

module.exports = {
    swaggerOptions
}