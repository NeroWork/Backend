const { ProductRepository } = require("../repository/product.repository");

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

const productRepository = new ProductRepository();

const authRoleOrOwnershipJWT = (role) => {
    return async (req, res, next) => {
        console.log(req.params.pid);
        console.log(req.user);
        // let prod = await productRepository.findProductById(req.params.pid);
        if(!req.user){
            console.log("401 no esta loggeado");
            return res.status(401).send({error: "Not Logged In"});
        }
        if(req.user.role != role) {
            console.log("403 no tiene permiso");
            return res.status(403).send({error: "Logged in but no permissions"});
        }
        next();
    }
}

module.exports = {
    authSession,
    authRoleJWT,
    authRoleOrOwnershipJWT
}