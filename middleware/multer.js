const multer = require('multer');
const path = require("path");


var Storage = multer.diskStorage({
    destination: (req, file, callback) => {

        callback(null, "uploads/");

    },
    filename: (req, file, callback) => {

        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        callback(null, uniqueName);

    }
});
var upload = multer({ storage: Storage });

module.exports = upload;