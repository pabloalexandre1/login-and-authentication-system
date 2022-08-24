const mongoose = require("mongoose");

var connection = mongoose.connect("mongodb://localhost:27017/yagenda", {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = connection;