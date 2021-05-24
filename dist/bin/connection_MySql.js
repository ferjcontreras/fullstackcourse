"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const config_1 = __importDefault(require("../config"));
//Conexion MySql
const connectionMySql = mysql_1.default.createConnection({
    host: config_1.default.HOST_DB,
    port: Number(config_1.default.PORT_DB),
    user: config_1.default.USER_DB,
    password: config_1.default.PASSWORD_DB,
    database: config_1.default.DB_MYSQL
});
exports.default = connectionMySql;
