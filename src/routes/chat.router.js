const { Router } = require("express");

const chatRouter = Router();

//----------------------ACCIONES-----------------------------
chatRouter.get("/", async (req, res) =>{
    res.render("chat");
})

module.exports = {
    chatRouter
}