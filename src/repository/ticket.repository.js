const { TicketManagerMongo } = require("../Dao/managerTicketMongo");

const ticketManager = new TicketManagerMongo();

class TicketRepository{
    constructor(){
        this.dao = ticketManager;
    }

    async createTicket (ticket){
        return await this.dao.postTicket(ticket);
    }
}

module.exports = {
    TicketRepository
}