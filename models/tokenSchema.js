
const mongoodb  = require("../server");
const Schema = mongoodb.Schema;


const token = new Schema({
    email: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true

    },
    token: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true

    },
   

});

module.exports = mongoodb.model("token", token);