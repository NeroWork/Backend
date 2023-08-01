const {Router} = require("express");
const { UserRepository } = require("../repository/user.repository");
const { isValidPassword, createHash } = require("../utils/bcrypt");

const userRouter = Router();
const userRepository = new UserRepository();

userRouter.get("/confirmUser/:mail", async (req, res) => {
    const mail = req.params.mail;
    const user = await userRepository.findUser({email: mail});
    console.log(user);
    res.send(user);
})

userRouter.get("/isValidPassword/:mail/:pass", async (req, res) => {
    const mail = req.params.mail;
    const pass = req.params.pass;
    const user = await userRepository.findUser({email: mail});

    const isValid = isValidPassword(user, pass);
    res.send(isValid);
})

userRouter.get("/hashPassword/:pass", async (req, res) => {
    const pass = req.params.pass;
    const hashedPass = createHash(pass);
    res.send(hashedPass);
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
    res.send(resp);
})

userRouter.put("/update/:uid", async (req, res) => {
    const uid = req.params.uid;
    const content = req.body;

    const resp = await userRepository.updateUser({_id: uid}, content);
    console.log(resp);
    res.send(resp);
})

userRouter.get("/premium/:uid", async (req, res) => {
    const uid = req.params.uid;

    res.render("changeRol", {uid});
})


module.exports = {
    userRouter
}