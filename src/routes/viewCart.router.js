const {Router} = require("express");
const { CartRepository } = require("../repository/cart.repository");
const { ProductRepository } = require("../repository/product.repository");
const { TicketRepository } = require("../repository/ticket.repository");
const passport = require("passport");
const { counterModel } = require("../models/counter.model");

const viewCartRouter = Router();
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

viewCartRouter.get("/:cid", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartRepository.findCartById(cid);
        res.render("cart",cart[0]);
    } catch (error) {
        res.render("error");
    }
})

module.exports = {
    viewCartRouter
}