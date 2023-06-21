const { ticketModel } = require("../models/ticket.model");

class TicketManagerMongo {
    async getTicketById(id){
        return await ticketModel.findById(id);
    }

    async postTicket(ticket){
        

        return await ticketModel.create(ticket);
    }
}

module.exports = {
    TicketManagerMongo
}