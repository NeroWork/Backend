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
    const cid = req.params.cid;
    const resp = await cartManager.getCartById(cid);
    res.send(resp);
})
cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resp = await cartManager.addCartProduct(cid,pid);
    res.send(resp);
})
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resp = await cartManager.deleteCartProduct(cid, pid);
    res.send(resp);
})
cartRouter.put("/:cid", async (req, res) => {
    let cid = req.params.cid;
    let update = req.body;
    console.log("update cargado");
    const resp = await cartManager.updateCartArray(cid, update);
    res.send(resp);
})
cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const update = req.body.quantityUpdate;
    const resp = await cartManager.updateProductQuantity(cid, pid, update);
    res.send(resp);
})
cartRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const resp = await cartManager.deleteCartArray(cid);
    res.send(resp);
})

module.exports = {
    cartRouter
}