const { Router } = require("express");
const { generateProducts } = require("../utils/faker");
const { ProductRepository } = require("../repository/product.repository");

const mockRouter = new Router();
const productRepository = new ProductRepository();

mockRouter.get("/", async (req, res) => {
    let products = await generateProducts(10);
    for (let index = 0; index < products.length; index++) {
        const element = await productRepository.addProduct(products[index]);
    }
    res.send(products);
})

module.exports = {
    mockRouter
}