const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "carts";

const cartSchema = new Schema({
    products: {
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number
            }
        ],
        default: []
    }
})

cartSchema.pre("find",function(){
    this.populate("products.product");
})

cartSchema.plugin(mongoosePaginate);

const cartModel = model(collection, cartSchema);

module.exports = {
    cartModel
}