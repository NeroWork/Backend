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

viewCartRouter.get("/:cid/purchase", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartRepository.findCartById(cid);
        console.log(cart[0]);
        let totalCompra = 0;
        let productosNoDisponibles = [];
        cart[0].products.forEach(element => {
            let stockSolicitado = element.quantity;
            let stockDisponible = element.product.stock;
            if(stockSolicitado <= stockDisponible){
                let update = productRepository.updateProduct(element.product._id, {stock: stockDisponible-stockSolicitado});
                let precioProducto = element.quantity * element.product.price;
                totalCompra = totalCompra + precioProducto;
            } else {
                productosNoDisponibles.push(element);
            }
        });

        let counter = await counterModel.findById("648fd8a49cfd322f711e8c83");
        let counterValor = counter.valor;
        console.log(counter);
        let date = new Date();
        let ticket = {
            code: counterValor,
            amount: totalCompra,
            purchaser: req.user.email,
            purchase_datetime: date
        }
        counter = await counterModel.updateOne({_id: "648fd8a49cfd322f711e8c83"}, {valor: counterValor+1});
        console.log(counter);
        let ticketCreated = await ticketRepository.createTicket(ticket);
        console.log(ticketCreated);
        console.log("El total de la compra es:" + totalCompra);
        console.log("Los productos no disponibles fueron: ");
        productosNoDisponibles.forEach(element => {
            console.log(element.product._id);
        });
        
        let newCart = await cartRepository.updateCartProducts(cid, {payload: productosNoDisponibles});
        console.log(newCart);
        res.send(productosNoDisponibles);
    } catch (error) {
        console.log(error);
    }
})

module.exports = {
    viewCartRouter
}