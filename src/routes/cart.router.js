const {Router} = require("express");
const { CartRepository } = require("../repository/cart.repository");
const { errorHandler } = require("../middleware/errorHandler");
const { generateInvalidParamInfo, EErrors, CustomError } = require("../utils/customError");
const passport = require("passport");
const { counterModel } = require("../models/counter.model");
const { TicketRepository } = require("../repository/ticket.repository");

const cartRouter = Router();
let cartRepository = new CartRepository();
let ticketRepository = new TicketRepository();

cartRouter.post("/", async (req, res) => {
    let cart = req.body;
    const resp = await cartRepository.addCart(cart);
    res.status(200).send(resp);
})
cartRouter.get("/:cid", errorHandler, async (req, res) => {
    try {        
        const cid = req.params.cid;
        const resp = await cartRepository.findCartById(cid);
        res.status(200).send(resp);
    } catch (error) {
        res.status(400).send(error);
    }
})

cartRouter.get("/:cid/purchase", passport.authenticate("jwt", {session: false}), async (req, res) => {
    const cid = req.params.cid;           //I save the id of the cart to purchase
    try {
        //--------Cart Managment---------------------------
        const cart = await cartRepository.findCartById(cid);                //I search the cart on the db with the saved ID
        // console.log(cart[0]);
        let totalCompra = 0;
        let productosNoDisponibles = [];
        cart[0].products.forEach(element => {                                 //For each product on the cart
            let stockSolicitado = element.quantity;
            let stockDisponible = element.product.stock;
            if(stockSolicitado <= stockDisponible){                          //if there is enough stock
                let update = productRepository.updateProduct(element.product._id, {stock: stockDisponible-stockSolicitado});   //I update the stock of the product on the db
                let precioProducto = element.quantity * element.product.price;     // calculate the full price
                totalCompra = totalCompra + precioProducto;                        //add it to the total
            } else {                                                         //if there is not enough stock
                productosNoDisponibles.push(element);                       //I push it in the array of products that couldn't be sold
            }
        });

        //-------Counter operations and ticket creation--------------
        let counter = await counterModel.findById("648fd8a49cfd322f711e8c83");          //I search for the counter
        let counterValor = counter.valor;                                               //save it's value
        // console.log(counter);
        let date = new Date();                                                          //I save the date
        let ticket = {                                                                  //Crate the ticket
            code: counterValor,
            amount: totalCompra,
            purchaser: req.user.email,
            purchase_datetime: date
        }
        counter = await counterModel.updateOne({_id: "648fd8a49cfd322f711e8c83"}, {valor: counterValor+1}); //update the counter on the db
        // console.log(counter);
        let ticketCreated = await ticketRepository.createTicket(ticket);                //create the ticket on the db
        console.log(ticketCreated);
        console.log("El total de la compra es:" + totalCompra);
        console.log("Los productos no disponibles fueron: ");

        //---------to finish--------------
        // productosNoDisponibles.forEach(element => {
        //     console.log(element.product._id);
        // });
        
        let newCart = await cartRepository.updateCartProducts(cid, {payload: productosNoDisponibles});
        console.log(newCart);
        res.status(200).send(productosNoDisponibles);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resp = await cartRepository.addProductToCart(cid,pid);
    res.status(200).send(resp);
})
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resp = await cartRepository.deleteProductFromCart(cid, pid);
    res.status(200).send(resp);
})
cartRouter.put("/:cid", async (req, res) => {
    let cid = req.params.cid;
    let update = req.body;
    console.log("update cargado");
    const resp = await cartRepository.updateCartProducts(cid, update);
    res.status(200).send(resp);
})
cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const update = req.body.quantityUpdate;
    const resp = await cartRepository.updateProductQuantity(cid, pid, update);
    res.status(200).send(resp);
})
cartRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const resp = await cartRepository.emptyCart(cid);
    res.status(200).send(resp);
})

module.exports = {
    cartRouter
}