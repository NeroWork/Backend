const {Router} = require("express");
const { ProductManagerMongo } = require("../Dao/managerProductMongo");

const productManager = new ProductManagerMongo();
const viewProductRouter = Router();

viewProductRouter.get("/", async (req, res) => {
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
    const resp = await productManager.getProducts(query, config);
    console.log(resp);
    res.render("products",resp)
})

viewProductRouter.get("/:pid", async (req, res) => {
    const {limit = 10, page = 1 } = req.query;
    const pid = req.params.pid;
    const prod = await productManager.getProductById(pid);
    res.render("oneProduct", {
        limit,
        page,
        prod
    })
})

module.exports = {
    viewProductRouter
}