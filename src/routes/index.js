const {Router} = require("express");
const { productRouter } = require("./product.router.js");
const { uploader } = require("../utils/uploader.js");
const { cartRouter } = require("./cart.router.js");
const { realtimeRouter } = require("./realTimeProducts.router.js");
const { chatRouter } = require("./chat.router.js");
const { viewProductRouter } = require("./viewProduct.router.js");
const { viewCartRouter } = require("./viewCart.router.js");
const { cookieRouter } = require("./cookie.router.js");
const { sessionRouter } = require("./session.router.js");
const { userRouter } = require("./user.router.js");

const router = Router();

router.use("/api/carrito", cartRouter);
router.use("/api/producto", productRouter);
router.use("/realTimeProducts", realtimeRouter);
router.use("/session", sessionRouter);
router.use("/api/usuarios", userRouter);
router.use("/chat", chatRouter);
router.use("/cookie", cookieRouter);
router.use("/views/products", viewProductRouter);
router.use("/views/cart", viewCartRouter);

router.post("/upload", uploader.single("file"), (req, res) => {
    res.send("Archivo subido");
})

module.exports = {
    router
}