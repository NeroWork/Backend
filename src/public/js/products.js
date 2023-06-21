const socket = io();
console.log("Llega al products.js");


const addToCartThis = async (cartId, prodId) => {
    // console.log("ADTOCARTTHIS")
    console.log(cartId);
    console.log(prodId);

    const resp = await fetch(`http://localhost:8080/api/carrito/${cartId}/products/${prodId}`,{
        method: "POST"
    })
    console.log("RESPUESTA---------");
    console.log( await resp);
}