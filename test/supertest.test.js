const supertest = require("supertest");
const chai = require("chai");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing App", () => {
    beforeEach( function() {
        this.timeout(5000);
    })
    describe("Product Router Test", () => {
        it("The GET endpoint api/producto/ must return all the products", async () => {
            const {
                _body
            } = await requester.get("/api/producto");
            expect(_body.docs[0]).to.have.property("_id");
        })
        it("The GET endpoint api/producto/:pid must return the product with the provided id", async () => {
            const {
                _body
            } = await requester.get("/api/producto/64c7269ee59b34702728b69a");
            expect(_body).to.have.property("_id");
        })
        it("The POST endpoint api/producto/ must add the provided product", async () => {
            const mockProduct = {
                title: "Jace Beleren",
                description: "Mtg card",
                thumbnail: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.magiclair.com.ar%2Fproducts%2Fjace-beleren-magic-2011&psig=AOvVaw1fAU36l0Biw5urLDcPyxZa&ust=1691682412948000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJCwgpz2z4ADFQAAAAAdAAAAABAE",
                price: 312,
                stock: 31
            }
            const {
                _body
            } = await requester.post("/api/producto").send(mockProduct);
            expect(_body).to.have.property("_id");
        })
        it("The PUT endpoint api/producto/:pid must update the product with the id provided", async () => {
            const mockProduct = {
                title: "Jace Beleren1",
                description: "Mtg card",
                thumbnail: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.magiclair.com.ar%2Fproducts%2Fjace-beleren-magic-2011&psig=AOvVaw1fAU36l0Biw5urLDcPyxZa&ust=1691682412948000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJCwgpz2z4ADFQAAAAAdAAAAABAE",
                price: 312,
                stock: 31
            }
            const {
                _body
            } = await requester.put("/api/producto/64d3b93034877a73fdc1668b").send(mockProduct);
            expect(_body.modifiedCount).to.be.ok.and.eql(1);
        })
        it("The Delete endpoint api/producto/:pid must delete the product with the id provided", async () => {
            const {
                _body
            } = await requester.delete("/api/producto/64d3b93034877a73fdc1668b");
            expect(_body.deletedCount).to.be.ok.and.eql(1);
        })
    })

    describe("Cart router Test", () => {
        it("The POST endpoint api/carrito must add a new cart with the specs provided", async () => {
            const cartMock = {

            }
            const {
                _body
            } = await requester.post("/api/carrito/").send(cartMock);
            expect(_body).to.have.property("_id");
        })
        it("The GET endpoint api/carrito/:cid must return the cart with the id provided", async () => {
            const {
                _body
            } = await requester.get("/api/carrito/64d3bbd41fed01cfe7581293");
            expect(_body[0]).to.have.property("_id");
        })
        it("The POST endpoint api/carrito/:cid/products/:pid must add a product to a cart", async () => {
            const {
                _body
            } = await requester.post("/api/carrito/64d3edec0d6c990a1d651bc9/products/64c7269ee59b34702728b69a");
            expect(_body.modifiedCount).to.be.eql(1);
        })
        it("The DELETE endpoint api/carrito/:cid/products/:pid must delete a product from a cart", async () => {
            const {
                _body
            } = await requester.delete("/api/carrito/64d3bbd41fed01cfe7581293/products/64c7269ee59b34702728b69a");
            expect(_body.modifiedCount).to.be.eql(1);
        })
        it("The PUT endpoint api/carrito/:cid/ must update the products from a cart", async () => {
            const mockProducts = {
                payload: [
                    {
                        title: "Jace Beleren",
                        description: "Mtg card",
                        thumbnail: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.magiclair.com.ar%2Fproducts%2Fjace-beleren-magic-2011&psig=AOvVaw1fAU36l0Biw5urLDcPyxZa&ust=1691682412948000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJCwgpz2z4ADFQAAAAAdAAAAABAE",
                        price: 312,
                        stock: 31
                    }
                ]
            }
            const {
                _body
            } = await requester.put("/api/carrito/64d3bbd41fed01cfe7581293").send(mockProducts);
            expect(_body.modifiedCount).to.be.eql(1);
        })
        it("The PUT endpoint api/carrito/:cid/products/:pid must update a product's quantity", async () => {
            const update = {
                quantityUpdate: 400
            }
            
            const {
                statusCode,
                ok,
                _body
            } = await requester.put("/api/carrito/64d3edec0d6c990a1d651bc9/products/64c7269ee59b34702728b69a").send(update);
            expect(_body.modifiedCount).to.be.eql(1);
        })
        it("The DELETE endpoint api/carrito/:cid/ must empty a cart", async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.delete("/api/carrito/64d3edec0d6c990a1d651bc9");
            expect(_body.modifiedCount).to.be.eql(1);
        })
    })

    describe("Sesion router test", () => {
        let cookie;
        it("The POST endpoint /session/register mus register and redirect the user, returning a status 302", async () => {
            const registerMock = {
                first_name: "Rocky",
                last_name: "Valvoa",
                email: "rocky@gmail.com",
                password: "12345",
                age: 12,
                phone: 123123123,
            }
            
            const {
                statusCode
            } = await requester.post("/session/register").send(registerMock);
            console.log(statusCode);
            expect(statusCode).to.be.eql(302);
        })
        it("The POST endpoint /session/login must login the user and set a cookie", async () => {
            const userMock = {
                email: "rocky@gmail.com",
                password: "12345"
            }
            
            const result = await requester.post("/session/login").send(userMock);
            const cookieResult = result.headers["set-cookie"][0];
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }

            expect(cookie.name).to.be.ok.and.eql("coderCookieToken");
            expect(cookie.value).to.be.ok;
        })
    })
})