const {Router} = require("express");
const { UserRepository } = require("../repository/user.repository");
const { isValidPassword, createHash } = require("../utils/bcrypt");
const nodemailer = require("nodemailer");
const { uploader } = require("../utils/uploader");
const { UserDTO } = require("../Dto/user.dto");
const passport = require("passport");
const { authRoleJWT } = require("../middleware/auth.middleware");

//transport to send emails
const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "coderprueba4@gmail.com",
        pass: "yjprdwnqiaauspll"
    }
})

//user Router and user Repository to work with users
const userRouter = Router();
const userRepository = new UserRepository();

//This get will send all the non sensible data of all the users with the help of a DTO
userRouter.get("/", async (req, res) => {
    try {        
        let allUsers = await userRepository.getAllUsers();
        let allUsersDTO = [];
        for (let index = 0; index < allUsers.length; index++) {
            let userDTO = new UserDTO(allUsers[index]);
            allUsersDTO.push(userDTO);
        }
        res.status(200).send(allUsersDTO);
    } catch (error) {
        res.status(400).send({status: "error", error: error});
    }
})

//This route will return the user with the given id
userRouter.get("/:uid", async (req, res) => {
    try {   
        let uid = req.params.uid;     
        let user = await userRepository.findUserById(uid);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({status: "error", error: error});
    }
})

//This route will delete all the users with more than 2 days offline, and send them an email
userRouter.delete("/", async (req, res) => {
    try {
        let allUsers = await userRepository.getAllUsers();
        let allUsersToDelete = [];
        for (let index = 0; index < allUsers.length; index++) {
            const lastConnectionUser = new Date(allUsers[index].last_connection);
            const date1 = new Date();
            const diffTime = Math.abs(date1 - lastConnectionUser);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

            if(diffDays > 2){
                await userRepository.deleteUserById(allUsers[index]._id);   
                allUsersToDelete.push({user: allUsers[index].email, last_connection: lastConnectionUser});
                let result = transport.sendMail({
                    from: "Pagina Coder coderprueba4@gmail.com",
                    to: allUsers[index].email,
                    subject: "Account deleted due to inactivity",
                    html: `
                        <div>Hola! Lamentablemente tu cuenta ha sido eliminada debido a que estuviste inactivo en los ultimos 2 dias!</div>
                        <div>
                            <p>Tu ultima conexion fue: ${lastConnectionUser}</p>
                        </div>
                    `,
                    attachments: []
                })
            }
        }

        res.status(200).send(allUsersToDelete);
    } catch (error) {
        res.status(400).send({status: "error", error: error});
    }
})

//This route will confirm that the email given belongs to an user and will return that user
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

//This route will confirm that a given password is valid for a given email
userRouter.get("/isValidPassword/:mail/:pass", async (req, res) => {
    const mail = req.params.mail;
    const pass = req.params.pass;
    const user = await userRepository.findUser({email: mail});

    const isValid = isValidPassword(user, pass);
    res.status(200).send(isValid);
})

//This route will recive a password and return a hashed version of it
userRouter.get("/hashPassword/:pass", async (req, res) => {
    const pass = req.params.pass;
    const hashedPass = createHash(pass);
    res.status(200).send(hashedPass);
})

//This route will update an user with a given email
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

//this route will update an user with the given id
userRouter.put("/update/:uid", async (req, res) => {
    const uid = req.params.uid;
    const content = req.body;

    const resp = await userRepository.updateUser({_id: uid}, content);
    console.log(resp);
    res.status(200).send(resp);
})

//this route will show the change rol page
userRouter.get("/premium/:uid", async (req, res) => {
    const uid = req.params.uid;

    res.status(200).render("changeRol", {uid});
})

//This route will show the upload page
userRouter.get("/:uid/documents", async (req,res) => {
    const uid = req.params.uid;
    res.render("upload", {id: uid});
})

//This route will confirm that the user has all the documents needed to be a premium user
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

userRouter.delete("/:uid", async(req, res) => {
    try {
        const uid = req.params.uid;
        const resp = await userRepository.deleteUserById(uid);
        res.status(200).send(resp);
    } catch (error) {
        res.status(400).send(error);
    }
})

//This route will upload documents to a given user
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

userRouter.get("/search/user", passport.authenticate("jwt", {session: false}), authRoleJWT("admin"), async (req, res) => {
    res.render("user");
})
module.exports = {
    userRouter
}