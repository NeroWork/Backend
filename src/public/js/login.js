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

    const resp = await fetch("http://localhost:8080/cookie/setSigned", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(object)
    })
    console.log(await resp.text());
})

const getCookie = async () => {
    const resp = await fetch("http://localhost:8080/cookie/getSigned", {
        method: "GET"
    });
    console.log( await resp.json());
}