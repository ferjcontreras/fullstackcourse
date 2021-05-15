"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_MySql_1 = __importDefault(require("../bin/connection_MySql"));
class EntrenadorModel {
    constructor() {
        this.Database_MySql = new connection_MySql_1.default("localhost", 3306, "root", "", "poke_app_utn");
    }
    createEntrenador(datos) {
        return this.Database_MySql.newEntrenador(datos);
    }
}
exports.default = EntrenadorModel;
