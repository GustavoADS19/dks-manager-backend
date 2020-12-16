const express = require("express");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const routes = express.Router();

const DemandController = require("./database/models/DemandModel");
const UserController = require("./database/models/UserModel");

routes.get("/demands", (request, response) => {
    if (request.query.email) {
        DemandController.find({demandado: request.query.email}).lean().exec((err, docs) => {
            response.send(docs);
        });
    } else {
        DemandController.find().lean().exec((err, docs) => {
            response.send(docs);
        });
    }
});

routes.get("/anexo/:id", (request, response) => {
    DemandController.findOne({ id: request.params.id }).lean().exec((err, docs) => {
        response.send(docs.anexo);
    });
});

routes.post("/register-demand", async (request, response) => {
    const id = crypto.randomBytes(32).toString("hex");
    var anexoPath = ``;

    const data = request.body;

    const agencia = data.agencia;
    const demandante = data.demandante;
    const demandado = data.demandado;
    const material = data.material;
    const dataLimite = data.dataLimite;
    const comentario = data.comentario;

    const demand = new DemandController({
        id,
        agencia,
        demandante,
        demandado,
        material,
        dataLimite,
        comentario,
        status: "Em análise",
        dataDeCriacao: new Date().toLocaleDateString('pt-BR'),
        anexo: {
            dados: request.body.anexoData
        }
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
    const password = crypto.createHash('sha1');
    password.update(request.body.password);
    const whatsapp = request.body.whatsapp;

    const data = { name, email, password: password.digest('hex'), whatsapp, verifiedMail: false, authToken: '' };
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
        const password = crypto.createHash('sha1');
        password.update(request.body.password);

        if (err) {
            response.status(400).send("Bad request.");
            return;
        }

        if (docs.length == 0) {
            response.status(404).send("Document not found.");
            return;
        }

        if (docs[0].password == password.digest('hex')) {
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

routes.post("/users", (request, response) => {
    UserController.find().select('-password -authToken -_id').lean().exec((err, docs) => {
        response.send(docs);
    });
});

routes.post("/user", (request, response) => {
    const userMail = request.body.userMail;

    UserController.find({ email: userMail }).select('-password -authToken -_id').lean().exec((err, docs) => {
        response.send(docs);
    });
});

routes.post("/update-demand", (request, response) => {
    DemandController.findOneAndUpdate({ id: request.body.id }, { status: request.body.status }).lean().exec((err, docs) => {
        response.send(docs);
    });
});

routes.post("/*", (request, response) => {
    response.status(404).send({message: "Cannot POST since route does not exist."});
});

module.exports = routes;