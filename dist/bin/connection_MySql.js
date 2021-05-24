"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const config_1 = require("../config");
//Conexion MySql
const connectionMySql = mysql_1.default.createConnection({
    host: config_1.env_bdd.DB_HOST,
    port: Number(config_1.env_bdd.DB_PORT),
    user: config_1.env_bdd.DB_USER,
    password: config_1.env_bdd.DB_PASSWORD,
    database: config_1.env_bdd.DB_NAME
});
exports.default = connectionMySql;
