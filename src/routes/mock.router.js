const { Router } = require("express");
const { generateProducts } = require("../utils/faker");

const mockRouter = new Router();

mockRouter.get("/", async (req, res) => {
    let products = await generateProducts(100);
    res.send(products);
})

module.exports = {
    mockRouter
}