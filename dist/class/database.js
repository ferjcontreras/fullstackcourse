"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
//Conexion MySql
const CONECTION = mysql_1.default.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "mantenimiento"
});
CONECTION.connect((error) => {
    if (error) {
        throw error;
    }
    else {
        console.log("Aplicacion conectada a MySql");
    }
});
exports.default = CONECTION;
