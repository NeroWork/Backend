console.log("script1");

let id_old_pass = document.getElementById("old-pass-id");
let id_new_pass = document.getElementById("new-pass-id");
let id_new_pass2 = document.getElementById("new-pass-id-2");

console.log("script2");

const reset = async (mail) => {
    const RespUser = await fetch(`http://localhost:8080/api/usuarios/confirmUser/${mail}`, {
        method: "GET"
    });
    const user = await RespUser.json();
    console.log("---------------------user----------------------");
    console.log(user);
    if(!user){
        console.log("Mail no valido")
        return false;
    }

    let old_pass = id_old_pass.value;
    let new_pass = id_new_pass.value;
    let new_pass2 = id_new_pass2.value;

    //Primer chequeo
    const isValidResp = await fetch(`http://localhost:8080/api/usuarios/isValidPassword/${mail}/${old_pass}`, {
        method: "GET"
    });
    const isValid = await isValidResp.json();
    console.log("------------------isValid-----------------")
    console.log(isValid)
    if(!isValid){
        console.log("Contraseña no valida");
        return false;
    }

    //segundo chequeo
    if(old_pass === new_pass){
        console.log("Las contraseñas coinciden");
        return false;
    }

    //Tercer chequeo
    if(new_pass !== new_pass2){
        console.log("Las contraseñas nuevas no coinciden");
        return false;
    }

    //Crear contraseña hasheada
    let password_hashed_resp =  await fetch(`http://localhost:8080/api/usuarios/hashPassword/${new_pass}`, {
        method: "GET"
    });
    let password_hashed = await password_hashed_resp.text();
    console.log("password-hashed es: ", password_hashed);
    //actualizar usuario con nueva contraseña
    const updateResp = await fetch(`http://localhost:8080/api/usuarios/updateUser/${mail}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({password: password_hashed})
    })
    const update = await updateResp.json();
    console.log(update);
}

