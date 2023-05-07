const passport = require("passport");
const local = require("passport-local");
const { userModel } = require("../models/user.model");
const { createHash, isValidPassword } = require("../utils/bcrypt");

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use("register", new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"
        },
        async (req, email, password, done) => {
            const {first_name, last_name, age} = req.body;
            try {
                let user = await userModel.findOne({email});
                if(user){
                    console.log("Ya existe este usuario");
                    return done(null,false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error getting the user: "+error);
            }
        }
    ))
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    })
    passport.use("login", new LocalStrategy({usernameField: "email"}, async (email, password, done) => {
        console.log("login try");
        try {
            const user = await userModel.findOne({email});
            if(!user){
                console.log("User doesn't exist");
                return done(null, false);
            }
            if(!isValidPassword(user, password)){
                console.log("Invalid password");
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            console.log("error: "+error)
            return done(error);
        }
    }))
}

module.exports = {
    initializePassport
}