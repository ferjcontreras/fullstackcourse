"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
//Conexion Mongo
class DatabaseMongo {
    constructor(host, port, user, password, database) {
        this.CONECTION = mongoose_1.default.connect(`mongodb://${host}:${port}/${database}`, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (error) => {
            if (error) {
                throw error;
            }
            else {
                console.log("Aplicacion conectada a Mongo");
            }
            ;
        });
    }
}
exports.default = DatabaseMongo;
