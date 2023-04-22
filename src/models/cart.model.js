const {Schema, model} = require("mongoose");

const collection = "carts";

const cartSchema = new Schema({
    products: [{
        id: String,
        quantity: Number,
        _id: false
    }]
})

const cartModel = model(collection, cartSchema);

module.exports = {
    cartModel
}