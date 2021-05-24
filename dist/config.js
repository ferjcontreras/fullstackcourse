"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../env', process.env.NODE_ENV + '.env')
});
let variables_entorno = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3000,
    HOST_DB: process.env.HOST_DB || 'localhost',
    PORT_DB: process.env.PORT_DB || 3306,
    USER_DB: process.env.USER_DB || 'root',
    PASSWORD_DB: process.env.PASSWORD_DB || '',
    DB_MYSQL: process.env.DB_MYSQL || 'recibos_app'
};
exports.default = variables_entorno;
