const select = document.getElementById("rol-select");

const changeRol = async (uid) => {
    const value = select.value;
    console.log(value);
    let valid = true;
    if(value === "premium"){
        const resp = await fetch(`http://localhost:8080/api/usuarios/${uid}/validateDocuments`, {
            method: "GET"
        })
        let respJson = await resp.json();
        console.log(respJson);
        valid = respJson;
    }
    if(valid){
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
    } else {
        let h3Warning = document.getElementById("warningDocs");
        h3Warning.innerHTML = "You need to upload the documents first!!";
    }
}