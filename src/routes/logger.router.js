const { Router } = require("express");

const loggerRouter = new Router();

loggerRouter.get("/", (req, res) => {
    res.render("logger");
})

loggerRouter.post("/:level", (req, res) => {
    const level = req.params.level;
    if(level == "Debug"){req.logger.debug("Debug message!")}
    if(level == "Http"){req.logger.http("Http message!")}
    if(level == "Info"){req.logger.info("Info message!")}
    if(level == "Warning"){req.logger.warning("Warning message!")}
    if(level == "Error"){req.logger.error("Error message!")}
    if(level == "Fatal"){req.logger.fatal("Fatal message!")}
    res.send("ok");
})

module.exports = {
    loggerRouter
}