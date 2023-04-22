const socket = io();
console.log("Chat on");

let email_input = document.getElementById("mail-id");
let message_input = document.getElementById("message-id");
let submit_button = document.getElementById("submit-button2");
let chat_container = document.getElementById("c-c");

submit_button.addEventListener("click", evt => {
    evt.preventDefault();
    let email = email_input.value;
    let message = message_input.value;

    if( email && message ){
        socket.emit("add_message", {user: email, message});
    } else {
        console.log("faltan campos");
    }

    email_input.value = "";
    message_input.value = "";
})

socket.on("actualizarMensajes", data => {
    let contentHTML = "";
    data.chatArray.forEach(element => {
        contentHTML = contentHTML + `<div>
            <p>Usuario: ${element.user}</p>
            <p>Mensaje: ${element.message}</p>
        </div>
        `
    });
    console.log(contentHTML);
    chat_container.innerHTML = contentHTML;
})