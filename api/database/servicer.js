var mongoose = require("mongoose");

const ServicerModel = new mongoose.Schema({
    name: String,
    name_business: String,
    email: String,
    password: String,
    address: {
        state: String,
        city: String,
        district: String,
        adrees_description: String,
        cep: Number
        
    },
    valid: String,
    recoverpass: String,
    sessionid: String
});

module.exports = ServicerModel;