"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
//Conexion MySql
class DatabaseMysql {
    constructor(host, port, user, password, database) {
        this.CONECTION = mysql_1.default.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
            database: database
        });
    }
    start() {
        this.CONECTION.connect((error) => {
            if (error) {
                throw error;
            }
            else {
                console.log("Aplicacion conectada a MySql");
            }
        });
    }
}
exports.default = DatabaseMysql;
