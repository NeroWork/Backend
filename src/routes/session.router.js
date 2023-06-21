const {Router} = require("express");
const { createHash, isValidPassword } = require("../utils/bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { UserDTO } = require("../Dto/user.dto");
const { UserRepository } = require("../repository/user.repository");
const { CartRepository } = require("../repository/cart.repository");
const { cartRouter } = require("./cart.router");

const cartRepository = new CartRepository();
const sessionRouter = new Router();
const userRepository = new UserRepository();


//-------------Manejo de sesiones basico----------------------
sessionRouter.get("/", (req, res) => {
    res.send("Antes trabaja con sesiones :O")
})
sessionRouter.get("/logout", (req, res) => {
    //-----------USANDO JWT----------
    res.clearCookie("coderCookieToken").redirect("/session/render");
})

sessionRouter.get("/render", passport.authenticate("jwt", {session: false, failureRedirect: "/session/login", successRedirect:"../views/products"}), async  (req, res) => {
})

sessionRouter.get("/login", async (req, res) => {
    res.render("login");
})

//--------------------Register-------------
sessionRouter.get("/register", passport.authenticate("jwt", {session: false, successRedirect: "/session/current", failureRedirect: "/session/registerRender"}), async (req, res) => {
})

sessionRouter.get("/registerRender", async (req, res) => {
    res.render("register");
})

//------------------Register con Passport-------------------
sessionRouter.post("/register",passport.authenticate("register",{failureRedirect: "/session/failregister"}), async (req, res) => {
    res.redirect("/views/products?limit=2");
})

sessionRouter.get("/failregister", async (req, res) => {
    console.log("Failed strategy");
    res.send({status: "Error", message: "Strategy error"});
})

sessionRouter.post("/login", passport.authenticate("login", {failureRedirect: "/session/faillogin", session: false}), async (req, res) => {
    if(!req.user){
        console.log("!req.user");
        return res.status(400).send({status:"error", error:"Invalid credentials"});
    }
    // console.log("req.user existe");
    // console.log(req.user);
    if(req.user.cart === null){
        const newCart = await cartRepository.addCart();
        let newCartId = newCart._id.toHexString();
        console.log(newCartId);
        const resp = await userRepository.updateUser({email: req.user.email}, {cart: newCartId})
        console.log(resp);
        req.user.cart = newCartId;
    }

    let token = jwt.sign({
        logged: true,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cart
    }, "sercretoIncreiblementeSeguro", {expiresIn: "24h"});

    res.cookie("coderCookieToken", token, {maxAge: 60*60*1000, httpOnly: true}).status(200).send("Success");
})

sessionRouter.get("/faillogin", async (req, res) => {
    res.send({error: "Login failed"});
})
//-----------------------PERFIL---------------
sessionRouter.get("/current", passport.authenticate("jwt", {session: false}), async (req, res) => {
    console.log(req.user);
    const user = await userRepository.findUser({first_name: req.user.first_name});
    if(user){
        const userInfo = new UserDTO(user); //-------DTO---------
        return res.render("perfil", userInfo);
    } else{
        return res.status(500).send("Something went wrong!!!!");
    }

})

//------Github---------
sessionRouter.get("/github", passport.authenticate("github", {scope:["user:email"], session: false}), async (req, res) => {

})

sessionRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login", session: false}), async (req, res) => {
    console.log(req.user);
    if(req.user.cart === null){
        const newCart = await cartRepository.addCart();
        let newCartId = newCart._id.toHexString();
        console.log(newCartId);
        const resp = await userRepository.updateUser({email: req.user.email}, {cart: newCartId})
        console.log(resp);
        req.user.cart = newCartId;
    }
    let token = jwt.sign({
        logged: true,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cart
    }, "sercretoIncreiblementeSeguro", {expiresIn: "24h"});

    res.cookie("coderCookieToken", token, {maxAge: 60*60*1000, httpOnly: true}).redirect("/views/products?limit=2");
})

module.exports = {
    sessionRouter
}