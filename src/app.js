//  -------------- REQUIRE ----------------
const express = require("express");
const {productsRouter} = require("./routes/products.router");
const {cartRouter} = require("./routes/cart.router");
const handlebars = require("express-handlebars");
const {Server} = require("socket.io");
const {realtimeRouter} = require("./routes/realTimeProducts.router");
const { ProductManager } = require("./utils/productManager");
const { CartManager } = require("./utils/cartManager");

//------------ MAPEADOR DE URL -------------
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+"/public"));

//--------------CUESTIONES DE HANDLEBARS----------------------
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+"/views");
app.set("view engine", "handlebars");
//-------------- IMPLEMENTACION DEL SERVIDOR -----------------
app.use("/api/products",productsRouter);
app.use("/api/carts",cartRouter);
app.use("/realtimeproducts", realtimeRouter);
const httpServer = app.listen(8080, () => console.log("server open"));
//----------------------ELEMENTOS DE PRUEBA------------------------
let products = new ProductManager();
let carts = new CartManager();

const validar = async (productoNuevo) => {
    if(productoNuevo.title && productoNuevo.description && productoNuevo.price && productoNuevo.stock){ //SI EXISTEN CAMPOS
        return true;
    } else {
        return false;
    }
}
//-----------------------SOCKET.IO-----------------------------
const socketServer = new Server(httpServer);
//prueba
socketServer.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    let productsArray = await products.getProducts();
    socketServer.emit("actualizar", {productsArray});

    socket.on("add_item", async (productAux) =>{
        await products.addProduct(productAux);
        productsArray = await products.getProducts();
        socketServer.emit("actualizar", {productsArray});
        console.log("producto agregado");
    })

    socket.on("delete_item", async (idaux) =>{
        idaux = parseInt(idaux);
        if(idaux === undefined || isNaN(idaux)){
            return console.log("El id ingresado no es valido");
        }
        let productoNuevo = await products.getProductById(idaux);
        if(productoNuevo){
            await products.deleteProduct(idaux);
            productsArray = await products.getProducts()
            socketServer.emit("actualizar", {productsArray});
        } else{
            console.log("No existe producto con ese id");
        }
    })
})