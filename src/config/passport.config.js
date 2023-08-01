const passport = require("passport");
const local = require("passport-local");
const { createHash, isValidPassword } = require("../utils/bcrypt");
const GitHubStrategy = require("passport-github2");
const jwt = require("passport-jwt");
const { UserRepository } = require("../repository/user.repository");

//-----------Strategies----------------
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;


//--------------Aux-functions------------
const userRepository = new UserRepository;

const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies["coderCookieToken"];
    }
    return token;
}
const cookiePassResetExtractor = (req) => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies["TimerPasswordReset"];
    }
    return token;
}

//-------Main code-----------------------------
const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "sercretoIncreiblementeSeguro"
    }, async (jwt_payload, done) => {
        try {
            return done(null,jwt_payload);
        } catch (error) {
            return done(error);
        }
    }
    ))
    
    passport.use("token_Password_Reset", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookiePassResetExtractor]),
        secretOrKey: "sercretoIncreiblementeSeguro"
    }, async (jwt_payload, done) => {
        try {
            return done(null,jwt_payload);
        } catch (error) {
            return done(error);
        }
    }
    ))

    passport.use("github", new GitHubStrategy({
        clientID:"Iv1.8e3accf601cfcb7b",
        clientSecret: "a288cfafbb04aded99cfbddf4a70497f51df3284",
        callbackURL:"http://localhost:8080/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userRepository.findUser({email: profile._json.email});
            if(!user){
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 18,
                    email: profile._json.email,
                    password: ""
                }
                let result = await userRepository.addUser(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }
    ))
    passport.use("register", new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"
        },
        async (req, email, password, done) => {
            const {first_name, last_name, age} = req.body;
            try {
                let user = await userRepository.findUser({email});
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
                let result = await userRepository.addUser(newUser);
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
        let user = await userRepository.findUserById(id);
        done(null, user);
    })
    passport.use("login", new LocalStrategy({usernameField: "email"}, async (email, password, done) => {
        console.log("login try");
        try {
            const user = await userRepository.findUser({email});
            if(!user){
                console.log("User doesn't exist");
                return done(null, false);
            }
            if(!isValidPassword(user, password)){
                console.log("Invalid password");
                return done(null, false);
            }
            console.log("fue gud")
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