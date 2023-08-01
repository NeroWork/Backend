const form = document.querySelector("#cookieForm");
const reset_pass_button = document.getElementById("reset_pass_button");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datosForm = new FormData(form);
    // console.log(datosForm);
    const object = {};
    datosForm.forEach((value, key) => {
        object[key] = value;
    });
    console.log(object);

    const resp = await fetch("http://localhost:8080/session/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    })
    if(await resp.text() === "Success"){
        console.log("Correcamente loggeado");
        location.href = "http://localhost:8080/views/products?limit=2"
    } else{
        console.log("error al logear");
        console.log(await resp);
    }
})

const getCookie = async () => {
    const resp = await fetch("http://localhost:8080/cookie/getSigned", {
        method: "GET"
    });
    console.log( await resp.json());
}


reset_pass_button.addEventListener("click", async (evt) => {
    evt.preventDefault();
    console.log("funcion recu_pass");
    let id_email_recu = document.getElementById("email_recu");
    let email_recu = id_email_recu.value;

    const resp = await fetch(`http://localhost:8080/mail/${email_recu}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    window.location.replace("http://localhost:8080/session/render"); 
})