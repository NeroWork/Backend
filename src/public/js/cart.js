console.log("JS ACTIVO")

const postCompra = async (id) => {
    console.log(id);
    const resp = await fetch(`http://localhost:8080/api/carrito/${id}/purchase`, {
        method: "GET"
    })
    console.log("done");
    location.href = `http://localhost:8080/views/cart/${id}`;
}

const cartEmpty = async (id) => {
    const resp = await fetch(`http://localhost:8080/api/carrito/${id}`, {
        method: "DELETE"
    })
    location.href = `http://localhost:8080/views/cart/${id}`;
}