const { CartManager } = require("../Dao/managerCartMongo")

const cartManager = new CartManager();

class CartRepository {
    constructor(){
        this.dao = cartManager;
    }

    async addCart(cart){
        return await cartManager.addCart(cart);
    }
    
    async findCartById(id){
        return await cartManager.getCartById(id);
    }

    async addProductToCart(cid, product){
        return await cartManager.addCartProduct(cid, product);
    }

    async deleteProductFromCart(cid, pid){
        return await cartManager.deleteCartProduct(cid, pid);
    }

    async updateCartProducts(cid, update){
        return await cartManager.updateCartArray(cid, update);
    }

    async updateProductQuantity(cid, pid, qU){
        return await cartManager.updateProductQuantity(cid,pid,qU)
    }

    async emptyCart(cid){
        return await cartManager.deleteCartArray(cid);
    }
}

module.exports = {
    CartRepository
}