const { Router } = require("express");

const realtimeRouter = Router();

//----------------------ACCIONES-----------------------------
realtimeRouter.get("/", async (req, res) =>{
    res.render("realTimeProducts");
})

module.exports = {
    realtimeRouter
}