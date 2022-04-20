
const mongoodb  = require("../server");
const Schema = mongoodb.Schema;


const dataBase = new Schema({
    fullName: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true

    },
    password: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true

    },
    email: {
        type: String,
        minlength: 7,
        maxlength: 255,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true

    },
    avatar:{
        type: String,
        required: true
    },
    active:{
        type: Boolean,
        required: true,
    }


});

module.exports = mongoodb.model("dataBase", dataBase);