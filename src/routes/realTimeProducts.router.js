const { Router } = require("express");
const { ProductManager } = require("../utils/productManager");

const realtimeRouter = Router();
let products = new ProductManager();

//--------------------- FUNCIONES AUXILIARES -----------------

//----------------------ACCIONES-----------------------------
realtimeRouter.get("/", async (req, res) =>{
    res.render("realTimeProducts");
})

module.exports = {
    realtimeRouter
}