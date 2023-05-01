const authSession = (req, res, next) => {
    if(req.session?.user?.logged !== true){
        return res.status(401).send("Error de autenticacion");
    }

    next();
}

module.exports = {
    authSession
}