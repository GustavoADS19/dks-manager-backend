const express = require("express");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const routes = express.Router();

const DemandController = require("./database/models/DemandModel");
const UserController = require("./database/models/UserModel");

routes.get("/demands", (request, response) => {
    DemandController.find().lean().exec((err, docs) => {
        response.send(docs);
    });
});

routes.post("/register-demand", async (request, response) => {
    const id = crypto.randomBytes(32).toString("hex");
    var anexoPath = ``;
    const uploadImage = await multer.diskStorage({
        destination: function (req, file, cb) {
            const demandPath = path.join(__dirname, "public", "images", id);
            fs.access(demandPath, error => {
                if (error) {
                    fs.mkdir(demandPath, error => {
                        return cb(error, demandPath);
                    });
                }
                return cb(null, demandPath);
            });
        },
        filename: function (req, file, cb) {
            anexoPath = `images/${id}/anexo${path.extname(file.originalname)}`;
            cb(null, "anexo" + path.extname(file.originalname));
        }
    });

    const anexoUpload = await multer({
        storage: uploadImage,
        limits: { fileSize: 8000000 },
    }).single("demandImage");

    await anexoUpload(request, response, (err) => {
        if (err) {
            console.log(err);
            response.status(500).send({ message: "Image upload failed.", error: err });
            return;
        }

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
            anexoPath
        });

        demand.save((err, doc) => {
            if (err) {
                throw err;
            }

            response.status(201).send({ message: "Demand uploaded successfully." });
        });

        console.log("Uploaded");
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

routes.post("/photo", (request, response) => {

});

routes.post("/*", (request, response) => {
    response.status(404).send({message: "Cannot POST since route does not exist."});
});

module.exports = routes;