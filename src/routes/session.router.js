const {Router} = require("express");
const { userModel } = require("../models/user.model");
const { createHash, isValidPassword } = require("../utils/bcrypt");
const passport = require("passport");

const sessionRouter = new Router()

//-------------Manejo de sesiones basico----------------------
sessionRouter.get("/", (req, res) => {
    if(req.session.counter){
        req.session.counter++;
        res.send(`Se visito el sitio ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        res.send("Bienvenido");
    }
})
sessionRouter.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if(!err){
            res.render("login");
        } else {
            res.send({status: "logout error", message: err});
        }
    })
})

sessionRouter.get("/render",async  (req, res) => {
    //Si ya esta loggeado que lo mande al perfil con la info del user
    if(req.session?.user?.logged === true){
        //Busco al user
        const user = await userModel.findOne({first_name: req.session.user.first_name});
        //Si lo encuentro
        if(user){
            const userInfo = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age
            }
            //renderizo perfil
            return res.render("perfil", userInfo);
        } else{
            //Sino mando error
            return res.status(500).send("Something wen't wrong!!!!");
        }
    }
    //Si no esta loggeado que se loggee
    res.render("login");
})

// sessionRouter.post("/login", (req, res) => {
//     const {username, password} = req.body;
//     if(username !== "Nero" || password !== "1234"){
//         return res.status(401).send("Username or password incorrect");
//     }
//     req.session.user = username;
//     req.session.admin = true;
//     res.send("Login completed");
// })

//--------------------Register-------------
sessionRouter.get("/register", async (req, res) => {
    //Si ya esta loggeado que lo mande al perfil con la info del user
    if(req.session?.user?.logged === true){
        //Busco al user
        const user = await userModel.findOne({first_name: req.session.user.first_name});
        //Si lo encuentro
        if(user){
            const userInfo = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age
            }
            //renderizo perfil
            return res.render("perfil", userInfo);
        } else{
            //Sino mando error
            return res.status(500).send("Something wen't wrong!!!!");
        }
    }
    //Si no esta loggeado que se registre
    res.render("register");
})

// sessionRouter.post("/register", async (req, res) => {
//     const {first_name, last_name, email, age, password} = req.body;
//     if(!first_name || !last_name || !email || !age || !password){
//         return res.status(400).send({status: "error", message: "Faltan campos"});
//     }
//     const newUser = {
//         first_name,
//         last_name,
//         email,
//         age,
//         password: createHash(password)
//     }
//     await userModel.create(newUser);
//     res.status(200).render("login")

// })

// sessionRouter.post("/login", async (req, res) => {
//     const {username, password} = req.body;

//     console.log(username)
//     console.log(password)
//     const user = await userModel.findOne({first_name: username});

//     if(!user){ return res.status(400).send("Username no valido")}
//     if(!isValidPassword(user, password)){
//         return res.status(403).send({status: "error", message: "Invalid password"});
//     }
//     delete user.password;

//     if(user.email === "adminCoder@coder.com" && user.password === "adminCod3r123"){
//         req.session.user = {
//             logged: true,
//             first_name: username,
//             role: "admin"
//         };
//     } else{
//         req.session.user = {
//             logged: true,
//             first_name: username,
//             role: "user"
//         };
//     }


//     res.status(200).send("Success");
// })
//------------------Register con Passport-------------------
sessionRouter.post("/register",passport.authenticate("register",{failureRedirect: "/failregister"}), async (req, res) => {
    res.send({status:"success", message:"User registered"});
})

sessionRouter.get("/failregister", async (req, res) => {
    console.log("Failed strategy");
    res.send({status: "Error", message: "Strategy error"});
})

sessionRouter.post("/login", passport.authenticate("login", {failureRedirect:"faillogin"}), async (req, res) => {
    if(!req.user){
        return res.status(400).send({status:"error", error:"Invalid credentials"});
    }
    console.log("req.user existe");
    console.log(req.user);
    req.session.user = {
        logged: true,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: "user"
    };

    res.status(200).send("Success");
})

sessionRouter.get("/faillogin", async (req, res) => {
    res.send({error: "Login failed"});
})
//-----------------------PERFIL---------------
sessionRouter.get("/perfil", async (req, res) => {
    if(req.session?.user?.logged !== true ){
        return res.render("login");
    }
    
    const user = await userModel.findOne({first_name: req.session.user.first_name});
    if(user){
        const userInfo = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age
        }

        return res.render("perfil", userInfo);
    } else{
        return res.status(500).send("Something wen't wrong!!!!");
    }

})

module.exports = {
    sessionRouter
}