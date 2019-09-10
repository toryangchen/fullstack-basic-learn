const mongoose = require("mongoose");

const personParams = new mongoose.Schema({ name: String, age: Number });

module.exports = mongoose.model("Person", personParams);
