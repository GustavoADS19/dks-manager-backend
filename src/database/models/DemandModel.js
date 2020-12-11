const mongoose = require("mongoose");

const DemandSchema = new mongoose.Schema({
    id: String,
    agencia: String,
    demandante: String,
    demandado: String,
    material: String,
    dataLimite: String,
    comentario: String,
    status: String,
    dataDeCriacao: Date,
    anexo: {
        dados: Buffer
    } 
});

const UserModel = mongoose.model("demands", DemandSchema);
module.exports = UserModel;