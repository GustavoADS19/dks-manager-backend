const express = require("express");
const path = require("path");
const routes = express.Router();

const DemandController = (require("./database/models/DemandModel"));

routes.get("/demands", (request, response) => {
    DemandController.find().lean().exec((err, docs) => {
        response.send(docs);
    });
});

routes.post("/register-demand", (request, response) => {
    const data = request.body;

    const agencia = data.agencia;
    const demandante = data.demandante;
    const demandado = data.demandado;
    const material = data.material;
    const dataLimite = data.dataLimite;
    const comentario = data.comentario;

    const demand = new DemandController({
        agencia,
        demandante,
        demandado,
        material,
        dataLimite,
        comentario
    });

    demand.save((err, doc) => {
        if (err) {
            throw err;
        }

        response.status(201).send({ message: "Demand uploaded successfully." });
    });
});

routes.post("/*", (request, response) => {
    response.status(404).send({message: "Cannot POST since route does not exist."});
});

module.exports = routes;