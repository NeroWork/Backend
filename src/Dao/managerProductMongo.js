const { productModel } = require("../models/product.model.js")

class ProductManagerMongo {
    async getProducts(query, config){
        return await productModel.paginate(query,config);
    }
    async getProductById(pid){
        return await productModel.findById(pid).lean();
    }
    async addProduct(newProduct){
        return await productModel.create(newProduct);
    }
    async updateProduct(pid, productToUpdate){
        return await productModel.updateOne({_id: pid}, productToUpdate);
    }
    async deleteProduct(pid){
        return await productModel.deleteOne({_id: pid}); 
    }
}

module.exports = {
    ProductManagerMongo
}