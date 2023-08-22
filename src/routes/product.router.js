const {Router} = require("express");
const { authSession, authRoleJWT, authRoleOrOwnershipJWT } = require("../middleware/auth.middleware");
const { ProductRepository } = require("../repository/product.repository");
const nodemailer = require("nodemailer");

const productRepository = new ProductRepository();

const productRouter = Router();

//transport to send emails
const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "coderprueba4@gmail.com",
        pass: "yjprdwnqiaauspll"
    }
})

productRouter.get("/", async (req, res) => {
    let prod = await productRepository.getAllProducts();
    res.status(200).send(prod);
})
productRouter.get("/:pid", async (req, res) => {
    try {
        const idAux = req.params.pid;
        if(idAux === undefined){
            return res.status(400).send({status:"error", error:"Invalid data"});
        }
        const resp = await productRepository.findProductById(idAux);
        res.status(200).send(resp);
    } catch (error) {
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
})
productRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    const resp = await productRepository.addProduct(newProduct);
    res.status(200).send(resp);
})
productRouter.put("/:pid", async (req, res) => {
    try {        
        const update = req.body;
        const idAux = req.params.pid;
        if(idAux === undefined){
            return res.status(400).send({status:"error", error:"Invalid data"});
        }
        const resp = await productRepository.updateProduct(idAux, update);
        res.status(200).send(resp);
    } catch (error) {
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
})
productRouter.delete("/:pid", async (req, res) => {
    try {        
        const idAux = req.params.pid;
        if(!idAux){
            return res.status(400).send({status:"error", error:"Invalid data"});
        }

        const product = await productRepository.findProductById(idAux);
        if(product.owner !== "admin"){
            let result = transport.sendMail({
                from: "Pagina Coder coderprueba4@gmail.com",
                to: product.owner,
                subject: "A product you own has been deleted",
                html: `
                    <div>Hola! Lamentablemente uno de los productos que te pertenecen a sido eliminado!</div>
                    <div>
                        <p>El producto eliminado fue: ${product.title}</p>
                    </div>
                `,
                attachments: []
            })
        }

        const resp = await productRepository.deleteProduct(idAux);
        res.status(200).send(resp);
    } catch (error) {
        return res.status(400).send({status:"error", error:"Invalid data"});
    }
})

module.exports = {
    productRouter
}