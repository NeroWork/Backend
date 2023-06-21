const authSession = (req, res, next) => {
    if(req.session?.user?.logged !== true){
        return res.status(401).send("Error de autenticacion");
    }

    next();
}

const authRoleJWT = (role) => {
    return async (req, res, next) => {
        if(!req.user){
            return res.status(401).send({error: "Not Logged In"});
        }
        if(req.user.role != role) {
            return res.status(403).send({error: "Logged in but no permissions"});
        }
        next();
    }
}

module.exports = {
    authSession,
    authRoleJWT
}