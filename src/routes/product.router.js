const {Router} = require("express");
const { authSession, authRoleJWT, authRoleOrOwnershipJWT } = require("../middleware/auth.middleware");
const { ProductRepository } = require("../repository/product.repository");

const productRepository = new ProductRepository();

const productRouter = Router();

productRouter.get("/", async (req, res) => {
    // //Traigo los params y defino valores por defecto
    // const {limit=10, page=1, sort = null} = req.query;
    // let {query = null} = req.query;
    // //Si hay query, la parseo, sino, la defino como objeto vacio
    // if(query){
    //     query = JSON.parse(query);
    // } else {
    //     query = {};
    // }
    // //Seteo la configuracion
    // let config = {};
    // if(sort){
    //     config = {limit, page, lean: true, sort: {price: sort}};
    // } else{
    //     config = {limit, page, lean: true};
    // }
    // //Envio los datos
    // const data = await productRepository.getAllProducts(query, config);
    // let resp = {};
    // if(data.docs){
    //     resp = {
    //         status: "success",
    //         payload: data.docs,
    //         totalPages: data.totalPages,
    //         prevPage: data.prevPage,
    //         nextPage: data.nextPage,
    //         page: data.page,
    //         hasPrevPage: data.hasPrevPage,
    //         hasNextPage: data.hasNextPage,
    //     }
    //     if(data.hasPrevPage){
    //         resp = {...resp, prevLink: `http://localhost:8080/api/producto?limit=${limit}&page=${data.prevPage}`}
    //     } else {
    //         resp = {...resp, prevLink: null};
    //     }
    //     if(data.hasNextPage){
    //         resp = {...resp, nextLink: `http://localhost:8080/api/producto?limit=${limit}&page=${data.nextPage}`}
    //     } else{
    //         resp = {...resp, nextLink: null}
    //     }
    // } else{
    //     resp = {
    //         status: "error"
    //     }
    // }
    // res.send(resp);

    let prod = await productRepository.getAllProducts();
    res.status(200).send(prod);
})
productRouter.get("/:pid", async (req, res) => {
    try {
        const idAux = req.params.pid;
        if(idAux === undefined){
            return res.status(400).send({status:"error", error:"Invalid data"});
        }
        const resp = await productRepository.findProductById(idAux);
        res.status(200).send(resp);
    } catch (error) {
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
})
productRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    const resp = await productRepository.addProduct(newProduct);
    res.status(200).send(resp);
})
productRouter.put("/:pid", async (req, res) => {
    try {        
        const update = req.body;
        const idAux = req.params.pid;
        if(idAux === undefined){
            return res.status(400).send({status:"error", error:"Invalid data"});
        }
        const resp = await productRepository.updateProduct(idAux, update);
        res.status(200).send(resp);
    } catch (error) {
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
})
productRouter.delete("/:pid", async (req, res) => {
    try {        
        const idAux = req.params.pid;
        if(idAux === undefined){
            return res.status(400).send({status:"error", error:"Invalid data"});
        }
        const resp = await productRepository.deleteProduct(idAux);
        res.status(200).send(resp);
    } catch (error) {
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
})

module.exports = {
    productRouter
}