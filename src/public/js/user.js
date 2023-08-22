const inputID = document.getElementById("userID");
const userContainer = document.getElementById("userContainer");

const getUser = async () => {
    console.log("hi");
    const uid = inputID.value;
    const resp = await fetch(`http://localhost:8080/api/usuarios/${uid}`, {
        method: "GET",
    })
    const respJSON = await resp.json();
    console.log(respJSON);
    if(!respJSON._id){
        userContainer.innerHTML(`
        <h2>The provided ID is not valid!</h2>
        `)
    } else {
        userContainer.innerHTML = `
        <div class="d-flex flex-column align-items-center">
            <h2>User info:</h2>
            <p>ID: ${respJSON._id}</p>
            <p>Email: ${respJSON.email}</p>
            <p>Role: ${respJSON.role}</p>
            <button class="btn btn-secondary my-3" onclick="deleteUser('${respJSON._id}')">Delete User</button>
            <button class="btn btn-secondary my-3" onclick="changeRolPage('${respJSON._id}')">Change Rol</button>
        </div>
        `
    }
}

const deleteUser = async (uid) => {
    const resp = await fetch(`http://localhost:8080/api/usuarios/${uid}`, {
        method: "DELETE",
    });
    console.log(resp);
    location.href = `http://localhost:8080/session/render`;
}

const changeRolPage = (uid) => {
    location.href = `http://localhost:8080/api/usuarios/premium/${uid}`;
}