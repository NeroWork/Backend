const { Router } = require("express");
const { authRoleJWT } = require("../middleware/auth.middleware");
const { UserDTO } = require("../Dto/user.dto");
const passport = require("passport");

const chatRouter = Router();

//----------------------ACCIONES-----------------------------
chatRouter.get("/", passport.authenticate("jwt", {session: false}), async (req, res) =>{         //Only user can do this
    // const userInfo = new UserDTO(user); //-------DTO---------
    res.render("chat", req.user);
})

module.exports = {
    chatRouter
}