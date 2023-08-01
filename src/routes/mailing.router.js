const { Router } = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const mailingRouter = Router();

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "coderprueba4@gmail.com",
        pass: "yjprdwnqiaauspll"
    }
})

mailingRouter.post("/:mail", async (req, res) => {
    console.log(":mail")
    const mail = req.params.mail;
    console.log("El mail es de tipo: ", typeof(mail));
    let result = transport.sendMail({
        from: "Pagina Coder coderprueba4@gmail.com",
        to: mail,
        subject: "Reset Password",
        html: `
            <div>Hola! Siguiendo este link podes cambiar tu contraseña:</div>
            <div>
                <a href='http://localhost:8080/api/resPass/${mail}'>Recuperar contraseña</a>
            </div>
        `,
        attachments: []
    })

    //token
    let token = jwt.sign({
        name: "time token"
    }, "sercretoIncreiblementeSeguro", {expiresIn: "24h"});

    res.cookie("TimerPasswordReset", token, {maxAge: 60*60*1000, httpOnly: true}).status(200).send("Done");
})

module.exports = {
    mailingRouter
}