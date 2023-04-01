console.log("al index llega");
const socket = io();

let id_delete = document.getElementById("delete-input");
let submit_add = document.getElementById("submit-button");

id_delete.addEventListener("keyup", evt=>{
    if(evt.key === "Enter"){
        socket.emit("delete_item",id_delete.value);
        id_delete.value="";
    }
});

socket.on("actualizar", data => {
    
})