const {Router} = require("express");

const cookieRouter = new Router();

//-----------UnSigned---------------------
cookieRouter.get("/set", (req, res) => {
    res.cookie("CoderCookie2", "Esta es una cookie", {maxAge: 500000}).send("Cookie enviada");
})

cookieRouter.get("/get", (req, res) => {
    res.send(req.cookies);
})
cookieRouter.get("/delete", (req, res) => {
    res.clearCookie("CoderCookie").send("Cookie deleted")
})

//-------------Signed-----------------------
cookieRouter.get("/setSigned", (req, res) => {
    res.cookie("CoderSignedCookie", "Esta es una cookie firmada", {maxAge: 500000, signed: true}).send("Cookie enviada");
})
cookieRouter.get("/getSigned", (req, res) => {
    res.send(req.signedCookies);
})

//----------Actividad---------------
cookieRouter.get("/login", (req, res) => {
    res.render("login");
})
cookieRouter.post("/setSigned", (req, res) => {
    const {first_name, password} = req.body;
    console.log(nombre);
    console.log(email);
    res.cookie(nombre,email, {maxAge:10000, signed: true}).send("okey")
})
module.exports = {
    cookieRouter
}