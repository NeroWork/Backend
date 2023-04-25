const {Router} = require("express");
const { CartManager } = require("../Dao/managerCartMongo");

const viewCartRouter = Router();
const cartManager = new CartManager();

viewCartRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    res.render("cart",cart[0]);
})

module.exports = {
    viewCartRouter
}