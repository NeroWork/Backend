console.log("al index llega");
const socket = io();

let id_delete = document.getElementById("delete-input");
let submit_add = document.getElementById("submit-button");
let contenedor_prod = document.getElementById("p-c");
let title_input = document.getElementById("title-id");
let description_input = document.getElementById("description-id");
let img_input = document.getElementById("img-id");
let price_input = document.getElementById("price-id");
let stock_input = document.getElementById("stock-id");

submit_add.addEventListener("click", evt => {
    evt.preventDefault();
    let title = title_input.value;
    let description = description_input.value;
    let thumbnail = img_input.value;
    let price = price_input.value;
    let stock = stock_input.value;
    if( title && description && thumbnail && price && stock ){
        socket.emit("add_item", {title,description,thumbnail,price,stock});
    } else {
        console.log("faltan campos");
    }

    title_input.value = "";
    description_input.value = "";
    img_input.value = "";
    price_input.value = "";
    stock_input.value = "";
})

id_delete.addEventListener("keyup", evt=>{
    if(evt.key === "Enter"){
        socket.emit("delete_item",id_delete.value);
        id_delete.value="";
    }
});

socket.on("actualizar", data => {
    let htmlcontent = "";
    data.productsArray.forEach(element => {
        htmlcontent = htmlcontent + `<div>
        <h2>${element.title}</h2>
        <p>${element.description}</p>
        <img src=${element.thumbnail} alt="Imagen del producto">
        <p>Precio: ${element.price}</p>
        <p>Stock: ${element.stock}</p>
        <p>ID: ${element._id}</p>
    </div>`
    });
    contenedor_prod.innerHTML=htmlcontent;
})