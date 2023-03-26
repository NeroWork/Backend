const {Router} = require("express");
const { CartManager } = require("../utils/cartManager");
const { ProductManager } = require ("../utils/productManager");

const cartRouter = Router();
let cartManager = new CartManager();
let productManager = new ProductManager();

//--------------------- FUNCIONES AUXILIARES -----------------

cartRouter.post("/", async (req,res) => {
    await cartManager.addCart();
    return res.send({status:"success", message:"New cart crated empty"});
});

cartRouter.get("/:cid", async (req,res) => {
    let idaux = parseInt(req.params.cid);
    let cartAux = await cartManager.getCartById(idaux);
    if(cartAux){
        return res.send(cartAux.products);
    }
    return res.status(400).send({status:"error", error:"Invalid data"});   
});

cartRouter.post("/:cid/products/:pid", async (req,res) => {
    let pidAux = parseInt(req.params.pid);
    let cidAux = parseInt(req.params.cid);
    let prodAux = await productManager.getProductById(pidAux);
    if(prodAux){
        let cartAux = await cartManager.getCartById(cidAux);
        if(cartAux){
            let addPtoC = await cartManager.addCartProduct(cidAux,pidAux);
            if(addPtoC){
                return res.send({status:"success", message:"Product added"});
            } else{
                return res.status(400).send({status:"error", error:"Invalid data"});
            }
        } else {
            return res.status(400).send({status:"error", error:"Invalid data"});
        }
    } else {
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
})

module.exports = {
    cartRouter
}