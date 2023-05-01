const {Router} = require("express");
const { ProductManagerMongo } = require("../Dao/managerProductMongo");
const { authSession } = require("../middleware/auth.middleware");

const productManager = new ProductManagerMongo();
const viewProductRouter = Router();

viewProductRouter.get("/",authSession, async (req, res) => {
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
    let resp = await productManager.getProducts(query, config);
    resp = {...resp, sort: sort, query: JSON.stringify(query), user_name: req.session.user.first_name}
    console.log(resp);
    if(resp.totalPages < page || page < 0){
        return res.send("Error page not found");
    }
    res.render("products",resp)
})

viewProductRouter.get("/:pid",authSession, async (req, res) => {
    try {
        const {limit = 10, page = 1 } = req.query;
        const pid = req.params.pid;
        const prod = await productManager.getProductById(pid);
        res.render("oneProduct", {
            limit,
            page,
            prod
        })
    } catch (error) {
        res.render("error")
    }

})

module.exports = {
    viewProductRouter
}