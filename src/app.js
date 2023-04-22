const express = require("express");
const { router } = require("./routes");
const handlebars = require("express-handlebars");
const { configObj } = require("./config/config");
const {Server} = require("socket.io");
const { ProductManagerMongo } = require("./Dao/managerProductMongo");
const { ChatManagerMongo } = require("./Dao/managerChatMongo");

//-----------CONFIGURAR SERVER -------------------
const app = express();
const PORT = 8080;

//----------------DB CONFIG---------------------------
configObj.connectDB();

//----------------------MAPEADOR URL----------------------------
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/static", express.static(__dirname+"/public"));

//-------------handlebars-----------------
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+"/views");
app.set("view engine", "handlebars");
//------------ROUTERS--------------
app.use(router);

//--------------LISTEN---------------
const httpServer = app.listen(PORT, error => {
    if(error){
        console.log(error);
    }
    console.log(`Server open ${PORT}`);
})

//---------------SOCKET IO--------------
const socketServer = new Server(httpServer);

//prueba
let productManager = new ProductManagerMongo();
let chatManager = new ChatManagerMongo();

socketServer.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    let productsArray = await productManager.getProducts();
    socketServer.emit("actualizar", {productsArray});

    let chatArray = await chatManager.getMessages();
    socketServer.emit("actualizarMensajes", {chatArray});

    socket.on("add_message", async (conjuntoMensaje) => {
       const resp = await chatManager.addMessage(conjuntoMensaje);
       chatArray = await chatManager.getMessages();
       socketServer.emit("actualizarMensajes", {chatArray});
    })

    socket.on("add_item", async (productAux) =>{
        await productManager.addProduct(productAux);
        productsArray = await productManager.getProducts();
        socketServer.emit("actualizar", {productsArray});
        console.log("producto agregado");
    })

    socket.on("delete_item", async (idaux) =>{
        console.log(idaux);
        console.log(typeof(idaux));
        if(idaux === undefined){
            return console.log("El id ingresado no es valido");
        }
        try {
            await productManager.deleteProduct(idaux);
            productsArray = await productManager.getProducts();
            socketServer.emit("actualizar", {productsArray});
        } catch (error) {
            return console.log(error);
        }
    })
})