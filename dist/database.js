"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../env/database.env')
});
let variables_entorno_bdd = {
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3306,
    USER: process.env.USER || 'root',
    PASSWORD: process.env.PASSWORD || '',
    DATABASE: process.env.DATABASE || 'recibos_app',
};
exports.default = variables_entorno_bdd;
