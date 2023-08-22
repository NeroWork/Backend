const dotenv = require ("dotenv");

dotenv.config();

const dotenvParams = {
    port:process.env.PORT,
    environment:process.env.ENVIRONMENT,
    mongoUrl: process.env.MONGOURL,
    cookieSecret: process.env.COOKIESECRET
}

module.exports = {
    dotenvParams
}