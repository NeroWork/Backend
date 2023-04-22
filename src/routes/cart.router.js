const {Router} = require("express");
const { CartManager } = require("../Dao/managerCartMongo");

const cartRouter = Router();
let cartManager = new CartManager();

cartRouter.post("/", async (req, res) => {
    let cart = req.body;
    const resp = await cartManager.addCart(cart);
    res.send(resp);
})
cartRouter.get("/:cid", async (req, res) => {
    res.send("get cart by id");
})
cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resp = await cartManager.addCartProduct(cid,pid);
    res.send(resp);
})

module.exports = {
    cartRouter
}