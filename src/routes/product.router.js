const {Router} = require("express");
const { ProductManagerMongo } = require("../Dao/managerProductMongo");

const productManager = new ProductManagerMongo();

const productRouter = Router();

productRouter.get("/", async (req, res) => {
    const resp = await productManager.getProducts();
    res.send(resp);
})
productRouter.get("/:pid", async (req, res) => {
    const idAux = req.params.pid;
    if(idAux === undefined){
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
    const resp = await productManager.getProductById(idAux);
    res.send(resp);
})
productRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    const resp = await productManager.addProduct(newProduct);
    res.send(resp);
})
productRouter.put("/:pid", async (req, res) => {
    const update = req.body;
    const idAux = req.params.pid;
    if(idAux === undefined){
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
    const resp = await productManager.updateProduct(idAux, update);
    res.send(resp);
})
productRouter.delete("/:pid", async (req, res) => {
    const idAux = req.params.pid;
    if(idAux === undefined){
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
    const resp = await productManager.deleteProduct(idAux);
    res.send(resp);
})

module.exports = {
    productRouter
}