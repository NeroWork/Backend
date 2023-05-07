const bcrypt = require("bcrypt");
const { model } = require("mongoose");

const createHash = (password) => {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

module.exports = {
    createHash,
    isValidPassword
}