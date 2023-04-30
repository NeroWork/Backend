const {Router} = require("express");

const sessionRouter = new Router()

sessionRouter.get("/", (req, res) => {
    if(req.session.counter){
        req.session.counter++;
        res.send(`Se visito el sitio ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        res.send("Bienvenido");
    }
})

module.exports = {
    sessionRouter
}