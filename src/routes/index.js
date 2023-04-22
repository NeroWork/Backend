const {Router} = require("express");
const { productRouter } = require("./product.router.js");
const { uploader } = require("../utils/uploader.js");
const { cartRouter } = require("./cart.router.js");
const { realtimeRouter } = require("./realTimeProducts.router.js");
const { chatRouter } = require("./chat.router.js");

const router = Router();

router.use("/api/carrito", cartRouter);
router.use("/api/producto", productRouter);
router.use("/realTimeProducts", realtimeRouter);
router.use("/chat", chatRouter);

router.post("/upload", uploader.single("file"), (req, res) => {
    res.send("Archivo subido");
})

module.exports = {
    router
}