"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env_email = exports.env_bdd = exports.env_server = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
//server
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../env', process.env.NODE_ENV + '.env')
});
let env_server = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    SERVER_HOST: process.env.HOST || 'localhost',
    SERVER_PORT: process.env.PORT || 3000
};
exports.env_server = env_server;
//bdd
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../env/bdd.env')
});
let env_bdd = {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME
};
exports.env_bdd = env_bdd;
//email
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../env/email.env')
});
let env_email = {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
};
exports.env_email = env_email;
