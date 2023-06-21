const {Router} = require("express");
const { CartRepository } = require("../repository/cart.repository");
const { errorHandler } = require("../middleware/errorHandler");
const { generateInvalidParamInfo, EErrors, CustomError } = require("../utils/customError");

const cartRouter = Router();
let cartRepository = new CartRepository();

cartRouter.post("/", async (req, res) => {
    let cart = req.body;
    const resp = await cartRepository.addCart(cart);
    res.send(resp);
})
cartRouter.get("/:cid", errorHandler, async (req, res) => {
    try {        
        const cid = req.params.cid;
        if(typeof(cid) !== "number"){
            CustomError.createError({
                name:"Get cart by id error",
                cause: generateInvalidParamInfo(cid),
                message: "Error trying to get a cart",
                code: EErrors.INVALID_PARAMS
            })
        }
        const resp = await cartRepository.findCartById(cid);
        res.send(resp);
    } catch (error) {
        res.send(error);
    }
})
cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resp = await cartRepository.addProductToCart(cid,pid);
    res.send(resp);
})
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const resp = await cartRepository.deleteProductFromCart(cid, pid);
    res.send(resp);
})
cartRouter.put("/:cid", async (req, res) => {
    let cid = req.params.cid;
    let update = req.body;
    console.log("update cargado");
    const resp = await cartRepository.updateCartProducts(cid, update);
    res.send(resp);
})
cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const update = req.body.quantityUpdate;
    const resp = await cartRepository.updateProductQuantity(cid, pid, update);
    res.send(resp);
})
cartRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const resp = await cartRepository.emptyCart(cid);
    res.send(resp);
})

module.exports = {
    cartRouter
}