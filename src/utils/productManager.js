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

class ProductManager{

    constructor(){
        this.path = "./src/baseProductos.json"

        //INICIALIZA EL ARCHIVO CON ARRAY VACIO
        if(!chequearExistencia(this.path)){
            let arrayAux = [];
            this.guardarBase(JSON.stringify(arrayAux));
        }
    }

    async guardarBase(contenido){
        //GUARDA EL CONTENIDO EN EL ARCHIVO
        await fs.promises.writeFile(this.path, contenido, "utf-8");
    }

    async addProduct(productoNuevo){
        let products = await this.getProducts(); //OBTIENE LOS PRODUCTOS
        let id = products.length; //TOMA EL ID COMO EL LARGO DEL ARRAY

        if(id === 0){ //SI EL ARRAY ESTA VACIO EL ID SERA 0
            products = [...products, {...productoNuevo, id}];
            await this.guardarBase(JSON.stringify(products));
        } else { //SINO
            let newID = products[id-1].id + 1 ; //EL ID SERA EL ID DEL ULTIMO ITEM DEL ARREGLO + 1
            products = [...products, {...productoNuevo, id: newID}]; //SE ACTUALIZA EL ARRAY CON EL NUEVO PRODUCTO
            await this.guardarBase(JSON.stringify(products)); // SE LO GUARDA
        }
    }
    async getProducts(){
        let arrayBruto = await fs.promises.readFile(this.path); //LEE EL ARCHIVO
        let products = JSON.parse( arrayBruto ); // LO VUELVE OBJETO
        return products; //LO DEVUELVE
    }
    async getProductById(IdAux){
        let products = await this.getProducts(); //OBTIENE EL ARREGLO
        let productoAux = products.find(prod => prod.id === IdAux); //BUSCA EL DE LA ID

        if(productoAux){ //SI EXISTE LO DEVUELVE
            return productoAux;
        } else { //SINO TIRA ERROR
            return undefined;
        }
    }
    async updateProduct(id, actualizacion){
        let products = await this.getProducts(); //NECESITO EL ARRAY PARA MODIFICARLO
        let prodcutoAux = products.find(prod => prod.id === id); //ENCUENTRO EL OBJETO

        if(prodcutoAux){ //SI EXISTE
            let indexAux = products.indexOf(prodcutoAux); //BUSCO EL INDEX
    
            let productoActualizado = {...prodcutoAux, ...actualizacion}; //ACTUALIZO EL PRODUCTO

            products[indexAux] = productoActualizado; //LO METO EN EL INDEX
    
            await this.guardarBase(JSON.stringify(products));//GUARDO
        }
    }
    async deleteProduct (id){
        let products = await this.getProducts(); //NECESITO EL ARRAY PARA MODIFICARLO
        let prodcutoAux = products.find(prod => prod.id === id); //ENCUENTRO EL OBJETO

        if(prodcutoAux){ //SI EXISTE
            let indexAux = products.indexOf(prodcutoAux); //BUSCO SU INDEX
            products.splice(indexAux,1); //LO BORRO
            await this.guardarBase(JSON.stringify(products));//GUARDO
        }
    }
}

module.exports = {
    ProductManager
}