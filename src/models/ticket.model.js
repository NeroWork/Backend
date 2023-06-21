const { Schema, model } = require("mongoose");

const collection = "tickets";

const ticketSchema = new Schema({
    code: Number,
    purchase_datetime: Date,
    amount: Number,
    purchaser: {
        type: String,
        required: true
    }
})

const ticketModel = model(collection, ticketSchema);

module.exports = {
    ticketModel
}