"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UsuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El email es requerido"]
    },
    password: {
        type: String,
        required: [true, "La clave es requerida"]
    },
    avatar: {
        type: String,
        default: "av-1.png"
    }
});
const Usuario = mongoose_1.model("Usuario", UsuarioSchema);
exports.default = Usuario;
