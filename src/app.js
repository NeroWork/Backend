const express = require("express");
const { router } = require("./routes");
const handlebars = require("express-handlebars");
const cors = require("cors");
const { configObj } = require("./config/config");
const {Server} = require("socket.io");
const { ProductManagerMongo } = require("./dao/managerProductMongo");
const { ChatManagerMongo } = require("./dao/managerChatMongo");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { initializePassport } = require("./config/passport.config");
const { addLogger } = require("./utils/logger");
const { dotenvParams } = require("./config/dotenv");
const swaggerJSDoc = require("swagger-jsdoc");
const { swaggerOptions } = require("./config/swagger");
const swaggerUiExpress = require("swagger-ui-express");

//-----------CONFIGURAR SERVER -------------------
const app = express();
const PORT = dotenvParams.port || 8080;
//----------------DB CONFIG---------------------------
configObj.connectDB();

//----------------------MAPEADOR URL----------------------------
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/static", express.static(__dirname+"/public"));

//----------------------Cookies------------------------
app.use(cookieParser(dotenvParams.cookieSecret));

//----------------------Cors------------------------
app.use(cors());
//----------------------Logger-----------------------
app.use(addLogger);

//-----------------------Passport----------------------
initializePassport();
app.use(passport.initialize());

//-------------handlebars-----------------
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+"/views");
app.set("view engine", "handlebars");
var Handlebars = handlebars.create({});
Handlebars.handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

//------------ROUTERS--------------
app.use(router);

//-------------SWAGGER----------------
const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//--------------LISTEN---------------
const httpServer = app.listen(PORT, "0.0.0.0", error => {
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