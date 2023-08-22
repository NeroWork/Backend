const { ProductManagerMongo } = require("../Dao/managerProductMongo");

const productManager = new ProductManagerMongo;

class ProductRepository {
    constructor(){
        this.dao = productManager;
    }

    async getAllProducts(query, config){
        return await this.dao.getProducts(query, config);
    }
 
    async findProductById(id){
        return await this.dao.getProductById(id);
    }
 
    async addProduct(product){
        return await this.dao.addProduct(product);
    }
 
    async updateProduct(pid, productUpdate){
        return await this.dao.updateProduct(pid, productUpdate);
    }
 
    async deleteProduct(pid){
        return await this.dao.deleteProduct(pid);
    }
}

module.exports = {
    ProductRepository
}