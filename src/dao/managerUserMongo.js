const { userModel } = require("../models/user.model");

class UserManager {
    async getAll(){
        return await userModel.find();
    }
    async add(user){
        return await userModel.create(user);
    }

    async find(param){
        return await userModel.findOne(param);
    }

    async findById(id){
        return await userModel.findById(id);
    }

    async update(filter, load){
        return await userModel.updateOne(filter, load);
    }

    async delete(id){
        return await userModel.deleteOne({_id: id}); 
    }
}

module.exports = {
    UserManager
}