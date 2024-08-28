const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//Review Schema
const userSchema = new Schema({
  email: { type: String, required: true },
});

//pass passport local schema as a plugin to user schema
//this plugin will create a username hashed password and salt value schema fields
userSchema.plugin(passportLocalMongoose);

//Reviews Collection
module.exports = mongoose.model("User", userSchema);
