//  -------------- REQUIRE ----------------
const express = require("express");
const {productsRouter} = require("./routes/products.router");
const {cartRouter} = require("./routes/cart.router");

//------------ MAPEADOR DE URL -------------
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+"/public"));

//-------------- IMPLEMENTACION DEL SERVIDOR -----------------
app.use("/api/products",productsRouter);
app.use("/api/carts",cartRouter);
app.listen(8080, () => console.log("server open"));
