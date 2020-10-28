const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    whatsapp: String,
    verifiedMail: Boolean,
    authToken: String
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;