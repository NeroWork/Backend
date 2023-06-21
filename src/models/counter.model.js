const { Schema, model } = require("mongoose");

const collection = "counters";

const counterSchema = new Schema({
    valor: {
        type: Number,
        default: 0
    }
})

const counterModel = model(collection, counterSchema);

module.exports = {
    counterModel
}