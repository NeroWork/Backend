const { chatModel } = require("../models/chat.model");

class ChatManagerMongo {
    async addMessage(conjuntoMensaje){
        return await chatModel.create(conjuntoMensaje);
    }
    async getMessages(){
        return await chatModel.find();
    }
}

module.exports = {
    ChatManagerMongo
}