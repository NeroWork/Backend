const form = document.querySelector("#cookieForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datosForm = new FormData(form);
    // console.log(datosForm);
    const object = {};
    datosForm.forEach((value, key) => {
        object[key] = value;
    });
    // console.log(object);

    const resp = await fetch("http://localhost:8080/session/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    })
    if(await resp.text() === "Success"){
        location.href = "http://localhost:8080/views/products?limit=2"
    };
})

const getCookie = async () => {
    const resp = await fetch("http://localhost:8080/cookie/getSigned", {
        method: "GET"
    });
    console.log( await resp.json());
}