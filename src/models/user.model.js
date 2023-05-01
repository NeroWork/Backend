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
        require: true
    },
    age:{
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

userSchema.plugin(mongoosePaginate);

const userModel = model(collection, userSchema);

module.exports = {
    userModel
}