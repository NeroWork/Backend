const { cartModel } = require("../models/cart.model.js");

class CartManager {
    async addCart(cart){
        return await cartModel.create(cart);
    }
    async getCartById(cid){
        return await cartModel.findById(cid);
    }
    async addCartProduct (cid, product){
        let carritoAux = await this.getCartById(cid);
        let products = carritoAux.products;
        let encontrado = false;
        products.forEach(element => {
            if(element.id == product){
                element.quantity = element.quantity +1;
                encontrado = true;
            }
        });
        if(!encontrado){
            products = [...products,{id: product, quantity:1}];
        }
        return await cartModel.updateOne({_id: cid}, {products: products});
    }
}

module.exports = {
    CartManager
}