const multer = require("multer");
const {dirname} = require("path")

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(file.fieldname === "profile"){
            cb(null, `${dirname(__dirname)}/public/uploads/profiles`);
        }
        if(file.fieldname === "product"){
            cb(null, `${dirname(__dirname)}/public/uploads/products`);
        }
        if(file.fieldname === "document"){
            cb(null, `${dirname(__dirname)}/public/uploads/documents`);
        }
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + " - " + Date.now() + " - " + `${file.originalname}`);
    }
});

const uploader = multer({
    storage,
    onError: (err, next) => {
        console.log(err);
        next();
    }
})

module.exports = {
    uploader
}