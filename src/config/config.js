const {connect} = require("mongoose");
const { cartModel } = require("../models/cart.model");
const url = "mongodb+srv://nerowork16:COpxK4EvOyJhsLBN@cluster0.rfxhx7c.mongodb.net/ecommerce?retryWrites=true&w=majority"

const configObj = {
    connectDB: async () => {
        try {
            await connect(url);
            console.log("Conectado a la db");
        } catch (error) {
            console.log(error);
            // ----------------------Populate Example--------------------
            // let cart = await cartModel.find({_id:"6446c3828ba358febf54f77f"}).populate("products.product");
            // console.log(JSON.stringify(cart, null,"\t"));
            //--------------------Populate Default---------------------
            // let cart = await cartModel.find({_id:"6446c3828ba358febf54f77f"});
            // console.log(JSON.stringify(cart, null,"\t"));
            
        }
    },
    url: url
}

module.exports = {
    configObj
}