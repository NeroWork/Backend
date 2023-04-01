const { Router } = require("express");
const { ProductManager } = require("../utils/productManager");

const realtimeRouter = Router();
let products = new ProductManager();

//--------------------- FUNCIONES AUXILIARES -----------------
const validar = async (productoNuevo) => {
    if(productoNuevo.code && productoNuevo.status !== undefined && productoNuevo.category && productoNuevo.title && productoNuevo.description && productoNuevo.price && productoNuevo.stock){ //SI EXISTE EL CODIGO
        let arrayProductos = await products.getProducts(); //OBTIENE LOS PRODUCTOS
        let buscar = arrayProductos.find(prod => prod.code === productoNuevo.code);//BUSCA EL QUE COINCIDA CON EL ID

        //SI !BUSCAR
        if(!buscar){
            return true;
        } else { //EN CASO DE QUE EL ID YA EXISTA
            return false;
        }
    } else {
        return false;
    }
}

realtimeRouter.get("/", async (req, res) =>{
    let productos = await products.getProducts();
    let limit = req.query.limit;
    if(limit){
        productos = productos.splice(0,limit);
        res.render("realTimeProducts",{productos});
    }
    if(!limit){
        res.render("realTimeProducts",{productos});
    }
})

realtimeRouter.get("/:pid", async (req,res) => {
    let idauxiliar = parseInt(req.params.pid);
    let productoNecesitado = await products.getProductById(idauxiliar);
    if(productoNecesitado){
        res.send(productoNecesitado);
    } else {
        res.status(400).send({status: "error", error: "No se encontro el producto solicitado"});
    }
})

realtimeRouter.post("/", async (req, res) => {
    let producto = req.body;
    const validacion = await validar(producto);
    if(!validacion){
        return res.status(400).send({status:"error", error: "Invalid data"});
    }
    products.addProduct(producto);
    res.send({status:"success", message:"Product uploaded"});
})

realtimeRouter.put("/:pid", async (req, res) => {
    let update = req.body;
    let idaux = parseInt(req.params.pid);
    if(idaux === undefined || isNaN(idaux)){
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
    let productoNuevo = products.getProductById(idaux);
    if(productoNuevo){
        products.updateProduct(idaux, update);
        return res.send({status:"success", message:"Product updated"});
    } else{
        res.status(400).send({status:"error", error:"Invalid data"});
    }
})

realtimeRouter.delete("/:pid", async (req,res) => {
    let idaux = parseInt(req.params.pid);
    if(idaux === undefined || isNaN(idaux)){
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
    let productoNuevo = products.getProductById(idaux);
    if(productoNuevo){
        products.deleteProduct(idaux);
        return res.send({status:"success", message:"Product deleted"});
    } else{
        res.status(400).send({status:"error", error:"Invalid data"});
    }

})

module.exports = {
    realtimeRouter
}