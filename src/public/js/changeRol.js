const select = document.getElementById("rol-select");

const changeRol = async (uid) => {
    console.log("hola");
    const value = select.value;
    console.log(value);
    const resp = await fetch(`http://localhost:8080/api/usuarios/update/${uid}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            role: value
        })
    })
    console.log(resp);
    location.href = `http://localhost:8080/session/logout`;
}