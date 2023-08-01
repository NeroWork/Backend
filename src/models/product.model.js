const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "products";

const productSchema = new Schema({
    title:{
        type: String,
        required: true,
        index: true
    },
    description:{
        type: String,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    owner: {
        default: "admin",
        type: String
    }
});

productSchema.plugin(mongoosePaginate);

const productModel = model(collection, productSchema);

module.exports = {
    productModel
}