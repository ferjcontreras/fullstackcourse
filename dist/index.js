"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./class/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const recibos_1 = __importDefault(require("./routes/recibos"));
const home_1 = __importDefault(require("./routes/home"));
const connection_MySql_1 = __importDefault(require("./bin/connection_MySql"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const MiServer = new server_1.default();
//start server
MiServer.start(() => {
    console.log(`Servidor corriendo en ${MiServer.host}:${MiServer.port}`);
});
//body parser
MiServer.app.use(body_parser_1.default.urlencoded({ extended: true }));
MiServer.app.use(body_parser_1.default.json());
//upload
MiServer.app.use(express_fileupload_1.default());
//start bddMySql
connection_MySql_1.default.connect((error) => {
    if (error) {
        throw error;
    }
    else {
        console.log("Aplicacion conectada a BDD MySQL");
    }
});
//rutas aplicacion
MiServer.app.use("/usuario", usuario_1.default); //localhost:3000/users/prueba
MiServer.app.use("/recibo", recibos_1.default);
MiServer.app.use("/", home_1.default);
