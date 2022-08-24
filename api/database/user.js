var mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    valid: String,
    recoverpass: String
});

module.exports = UserModel;