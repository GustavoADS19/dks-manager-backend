//DKS Manager
//Codificado por Matheus Ibrahim - 2020

//Módulos
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());

//Importando scripts externos
const routes = require("./routes");
const database = require("./database/connection");

//Variáveis
const port = process.env.PORT || 3333;

//Middlewares (express)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({limit: '50mb'}));
app.use(routes);

app.listen(port, console.log(`App listening on ${port}.`));