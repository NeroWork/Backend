const { cartModel } = require("../models/cart.model.js");

class CartManager {
    async addCart(cart){
        return await cartModel.create(cart);
    }
    async getCartById(cid){
        return await cartModel.find({_id:cid}).lean();
    }
    async addCartProduct (cid, product){
        let carritoAux = await this.getCartById(cid);
        let products = carritoAux[0].products;
        let encontrado = false;
        products.forEach(element => {
            if(element.product._id == product){
                element.quantity = element.quantity +1;
                encontrado = true;
            }
        });
        if(!encontrado){
            products = [...products,{product: product, quantity:1}];
        }
        return await cartModel.updateOne({_id: cid}, {products: products});
    }
    async deleteCartProduct(cid, pid){
        let auxCart = await this.getCartById(cid);
        let products = auxCart[0].products;
        let productAux = products.find(elem => elem.product._id == pid);
        let indexAux = products.indexOf(productAux);
        products.splice(indexAux,1);
        return await cartModel.updateOne({_id: cid}, {products: products});
    }
    async updateCartArray(cid, update){
        let arrayAux = [];
        update.payload.forEach(element => {
            arrayAux = [...arrayAux, {product: element.product, quantity: element.quantity}];
        });
        return await cartModel.updateOne({_id:cid}, {products: arrayAux});
    }
    async updateProductQuantity(cid,pid,qU){
        let carritoAux = await this.getCartById(cid);
        let products = carritoAux[0].products;
        products.forEach(element => {
            if(element.product._id == pid){
                element.quantity = qU;
            }
        });
        return await cartModel.updateOne({_id: cid}, {products: products});
    }
    async deleteCartArray(cid){
        return await cartModel.updateOne({_id: cid}, {products: []});
    }
}

module.exports = {
    CartManager
}