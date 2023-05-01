const {Router} = require("express");
const { ProductManagerMongo } = require("../Dao/managerProductMongo");
const { authSession } = require("../middleware/auth.middleware");

const productManager = new ProductManagerMongo();

const productRouter = Router();

productRouter.get("/",authSession, async (req, res) => {
    //Traigo los params y defino valores por defecto
    const {limit=10, page=1, sort = null} = req.query;
    let {query = null} = req.query;
    //Si hay query, la parseo, sino, la defino como objeto vacio
    if(query){
        query = JSON.parse(query);
    } else {
        query = {};
    }
    //Seteo la configuracion
    let config = {};
    if(sort){
        config = {limit, page, lean: true, sort: {price: sort}};
    } else{
        config = {limit, page, lean: true};
    }
    //Envio los datos
    const data = await productManager.getProducts(query, config);
    let resp = {};
    if(data.docs){
        resp = {
            status: "success",
            payload: data.docs,
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
        }
        if(data.hasPrevPage){
            resp = {...resp, prevLink: `http://localhost:8080/api/producto?limit=${limit}&page=${data.prevPage}`}
        } else {
            resp = {...resp, prevLink: null};
        }
        if(data.hasNextPage){
            resp = {...resp, nextLink: `http://localhost:8080/api/producto?limit=${limit}&page=${data.nextPage}`}
        } else{
            resp = {...resp, nextLink: null}
        }
    } else{
        resp = {
            status: "error"
        }
    }
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