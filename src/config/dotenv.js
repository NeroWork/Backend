const dotenv = require ("dotenv");

dotenv.config();

const dotenvParams = {
    port:process.env.PORT,
    environment:process.env.ENVIRONMENT
}

module.exports = {
    dotenvParams
}