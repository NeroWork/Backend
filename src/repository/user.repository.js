const { UserManager } = require("../Dao/managerUserMongo");

const userManager = new UserManager;

class UserRepository {
    constructor(){
        this.dao = userManager;
    }

    async getAllUsers(){
        return await this.dao.getAll();
    }

    async addUser(user){
        return await this.dao.add(user);
    }

    async findUser(param){
        return await this.dao.find(param);
    }

    async findUserById(id){
        return await this.dao.findById(id);
    }

    async updateUser(filter, load){
        return await this.dao.update(filter, load);
    }

    async deleteUserById(id) {
        return await this.dao.delete(id);
    }
}

module.exports = {
    UserRepository
}