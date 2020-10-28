const express = require("express");
const crypto = require("crypto");
const path = require("path");
const routes = express.Router();

const DemandController = require("./database/models/DemandModel");
const UserController = require("./database/models/UserModel");

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
        comentario,
        status: "Em análise"
    });

    demand.save((err, doc) => {
        if (err) {
            throw err;
        }

        response.status(201).send({ message: "Demand uploaded successfully." });
    });
});

routes.post("/create-user", (request, response) => {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const whatsapp = request.body.whatsapp;

    const data = { name, email, password, whatsapp, verifiedMail: false, authToken: '' };
    const user = new UserController(data);
    user.save((err, doc) => {
        if (err) {
            throw err;
        }
        
        response.status(201).send({ message: "User registered successfully." });
    });
});

routes.post("/login", (request, response) => {
    UserController.find({ email: request.body.email }).lean().exec((err, docs) => {
        if (err) {
            response.status(400).send("Bad request.");
            return;
        }

        if (docs.length == 0) {
            response.status(404).send("Document not found.");
            return;
        }

        if (docs[0].password == request.body.password) {
            const generatedToken = crypto.randomBytes(32).toString('hex');
            UserController.updateOne({ _id: docs[0]._id }, { authToken: generatedToken }, (err, raw) => {
                if (err) {
                    response.status(400).send();
                    return;
                }

                response.send({message: "Authenticated successfully", authorization: generatedToken});
            });
        } else {
            response.send("Not authenticated!");
        }
    });
});

routes.post("/auth", (request, response) => {
    const email = request.body.email;
    const token = request.body.token;

    UserController.findOne({ email: email }).lean().exec((err, doc) => {
        if (err) {
            throw err;
        }
        
        if (doc.authToken == token) {
            response.send({ authenticated: true });
        } else {
            response.send({ authenticated: false });
        }
    });
});

routes.post("/*", (request, response) => {
    response.status(404).send({message: "Cannot POST since route does not exist."});
});

module.exports = routes;