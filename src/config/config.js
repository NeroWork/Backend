const {connect} = require("mongoose");
const url = "mongodb+srv://nerowork16:COpxK4EvOyJhsLBN@cluster0.rfxhx7c.mongodb.net/ecommerce?retryWrites=true&w=majority"

const configObj = {
    connectDB: async () => {
        try {
            await connect(url);
            console.log("Conectado a la db");
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {
    configObj
}