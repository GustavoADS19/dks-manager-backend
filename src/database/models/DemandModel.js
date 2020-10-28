const mongoose = require("mongoose");

const DemandSchema = new mongoose.Schema({
    agencia: String,
    demandante: String,
    demandado: String,
    material: String,
    dataLimite: String,
    comentario: String,
    status: String,
});

const UserModel = mongoose.model("demands", DemandSchema);
module.exports = UserModel;