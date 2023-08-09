const {Router} = require("express");
const { CartRepository } = require("../repository/cart.repository");
const { ProductRepository } = require("../repository/product.repository");
const { TicketRepository } = require("../repository/ticket.repository");
const passport = require("passport");
const { counterModel } = require("../models/counter.model");
const jwt = require("jsonwebtoken");
const { UserRepository } = require("../repository/user.repository");

const viewCartRouter = Router();
const cartRepository = new CartRepository();
const userRepository = new UserRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

viewCartRouter.get("/:cid", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const cid = req.params.cid;
    try {
        let cart = await cartRepository.findCartById(cid);
        console.log(cart[0]);
        if(!cart[0]){
            const newCart = await cartRepository.addCart();
            console.log(newCart);
            const resp = await userRepository.updateUser({email: req.user.email}, {cart: newCart._id});
            cart[0] = newCart;

            let token = jwt.sign({
                logged: true,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                age: req.user.age,
                email: req.user.email,
                role: req.user.role,
                cart: newCart._id
            }, "sercretoIncreiblementeSeguro", {expiresIn: "24h"});
        
            res.cookie("coderCookieToken", token, {maxAge: 60*60*1000, httpOnly: true}).status(200).render("cart",cart[0]);;
        } else {
            res.render("cart",cart[0]);
        }
    } catch (error) {
        res.render("error");
    }
})

module.exports = {
    viewCartRouter
}