const fs = require("fs");
//--------------------- FUNCIONES AUXILIARES -----------------
const chequearExistencia = (ruta) => {
    if(fs.existsSync(ruta)){
        return true;
    } else {
        return false;
    }
}

//------------- IMPLEMENTACION DE LA CLASE -------------------

class CartManager{
    constructor(){
        this.path = "./src/baseCarrito.json";
        if(!chequearExistencia(this.path)){
            let arrayAux = [];
            this.guardarBase(JSON.stringify(arrayAux));
        }
    }

    async guardarBase(contenido){
        await fs.promises.writeFile(this.path, contenido, "utf-8");
    }

    async addCart(){
        let carritos = await this.getCarts();
        let idAux = carritos.length;
        let products = [];
        if(idAux === 0){
            carritos = [{id: idAux, products}];
            await this.guardarBase(JSON.stringify(carritos));
        } else {
            let newId = carritos[idAux-1].id + 1;
            carritos = [...carritos, {id: newId, products}];
            await this.guardarBase(JSON.stringify(carritos));
        }
    }

    async getCarts(){
        let arrayBruto = await fs.promises.readFile(this.path);
        let carts = JSON.parse(arrayBruto);
        return carts;
    }

    async getCartById(cid){
        let carritos = await this.getCarts();
        let cartAux = carritos.find(cart => cart.id === cid);

        if(cartAux){
            return cartAux;
        } else {
            return undefined;
        }
    }

    async addCartProduct (cid, pid){
        let cartAux = await this.getCartById(cid);
        let carts = await this.getCarts();
        console.log(carts);
        console.log(cartAux);
        let indexCarrito = carts.findIndex(elem => elem.id === cid);
        console.log(indexCarrito);
        if(cartAux){
            let productos = cartAux.products;
            let productoAux = productos.find(prod => prod.id === pid);
            if(productoAux){
                let indexAux = productos.findIndex(product => product.id === pid);
                let cantAux = productoAux.quantity + 1;
                let productoActualizado = {id: pid,quantity: cantAux}
                productos[indexAux] = productoActualizado;
                cartAux.products = productos;
                carts[indexCarrito] = cartAux;
                await this.guardarBase(JSON.stringify(carts));
                return 1;
            } else{
                let productoNuevo = {id: pid,quantity: 1}
                cartAux.products.push(productoNuevo);
                console.log(cartAux);
                carts[indexCarrito] = cartAux;
                console.log(carts);
                await this.guardarBase(JSON.stringify(carts));
                return 1;
            }
        } else{
            return undefined;
        }
    }
}

module.exports = {
    CartManager
}