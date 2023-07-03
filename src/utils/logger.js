const winston = require("winston");
const { dotenvParams } = require("../config/dotenv");

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "rainbow",
        error: "red",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white"
    }
}

const environment = dotenvParams.environment;

const logger = environment == "production" ?
winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level:"info",
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})
:
environment == "development" ?
winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level:"debug",
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})
:
null;

if(!logger){
    console.log("Environment not selected");
}

exports.addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}