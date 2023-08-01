const { Router } = require("express");
const passport = require("passport");

const passResetRouter = new Router();

passResetRouter.get("/:mail", passport.authenticate("token_Password_Reset", {session: false, failureRedirect: "/session/login"}), async (req,res) => {
    console.log("passrouter");
    const mail = req.params.mail;
    res.render("passRes", {mail});
})

module.exports = {
    passResetRouter
}