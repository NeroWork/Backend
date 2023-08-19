const {Router} = require("express");
const { UserRepository } = require("../repository/user.repository");
const { isValidPassword, createHash } = require("../utils/bcrypt");
const passport = require("passport");
const { uploader } = require("../utils/uploader");

const userRouter = Router();
const userRepository = new UserRepository();

userRouter.get("/confirmUser/:mail", async (req, res) => {
    const mail = req.params.mail;
    try {
        const user = await userRepository.findUser({email: mail});
        console.log(user);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(null);
    }

})

userRouter.get("/isValidPassword/:mail/:pass", async (req, res) => {
    const mail = req.params.mail;
    const pass = req.params.pass;
    const user = await userRepository.findUser({email: mail});

    const isValid = isValidPassword(user, pass);
    res.status(200).send(isValid);
})

userRouter.get("/hashPassword/:pass", async (req, res) => {
    const pass = req.params.pass;
    const hashedPass = createHash(pass);
    res.status(200).send(hashedPass);
})

userRouter.put("/updateUser/:user", async (req, res) => {
    const user = req.params.user;
    const content = req.body;

    console.log("user es: ", user);
    console.log("content es: ", content, " de tipo: ", typeof(content));

    if(!user){
        return res.status(400).send({status: "error", error: "invalid data"});
    }

    const resp = await userRepository.updateUser({email: user}, content);
    res.status(200).send(resp);
})

userRouter.put("/update/:uid", async (req, res) => {
    const uid = req.params.uid;
    const content = req.body;

    const resp = await userRepository.updateUser({_id: uid}, content);
    console.log(resp);
    res.status(200).send(resp);
})

userRouter.get("/premium/:uid", async (req, res) => {
    const uid = req.params.uid;

    res.status(200).render("changeRol", {uid});
})

userRouter.get("/:uid/documents", async (req,res) => {
    const uid = req.params.uid;
    res.render("upload", {id: uid});
})

userRouter.get("/:uid/validateDocuments", async (req, res) => {
    const uid = req.params.uid;
    const user = await userRepository.findUserById(uid);
    const documents = user.documents;
    let identificacion = false;
    let comprobanteDomicilio = false;
    let comprobanteEstadoCuenta = false;

    documents.forEach(element => {
        let value = element.name;
        let camps = value.split(" - ");
        value = camps[2];
        camps = value.split(".");
        value = camps[0];
        console.log(value);
        if(value === "Identificacion"){
            identificacion = true;
        } else if (value === "Comprobante de domicilio"){
            comprobanteDomicilio = true;
        } else if (value === "Comprobante de estado de cuenta"){
            comprobanteEstadoCuenta = true;
        }
    });

    if(identificacion === true && comprobanteDomicilio === true && comprobanteEstadoCuenta === true){
        return res.status(200).send(true);
    } else {
        return res.status(200).send(false);
    }
})

userRouter.post("/:uid/documents", uploader.any(), async (req, res) => {
    const uid = req.params.uid;
    if(!req.files){
        return res.status(400).send({status: "error", error: "No files detected"});
    }
    let newDocuments = 0;
    for (let index = 0; index < req.files.length; index++) {
        const element = req.files[index];
        if (element.fieldname === "document"){
            const user = await userRepository.findUserById(uid);
            let documentsUser = user.documents;
            documentsUser = [...documentsUser, {name: element.filename, reference: element.path}];
            await userRepository.updateUser({_id: uid}, {documents: documentsUser});
            newDocuments = newDocuments + 1;
        }
    }
    res.status(200).send({status: "success", newDocuments: newDocuments});
});

module.exports = {
    userRouter
}