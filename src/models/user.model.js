const {Schema, model} = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collection = "users";

const userSchema = new Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    age:{
        type: Number
    },
    password: {
        type: String,
        require: true
    },
    cart: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: "user"
    }
})

userSchema.plugin(mongoosePaginate);

const userModel = model(collection, userSchema);

module.exports = {
    userModel
}