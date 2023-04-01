//  -------------- REQUIRE ----------------
const express = require("express");
const {productsRouter} = require("./routes/products.router");
const {cartRouter} = require("./routes/cart.router");
const handlebars = require("express-handlebars");
const {Server} = require("socket.io");
const {realtimeRouter} = require("./routes/realTimeProducts.router")

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
//-----------------SOCKET.IO-----------------------------------
const socketServer = new Server(httpServer);
//prueba
socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");
    
})