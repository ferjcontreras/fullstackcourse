"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const usuarioController = __importStar(require("../controllers/usuarios"));
const UsuarioRoutes = express_1.Router(); //no new! Router no es clase
UsuarioRoutes.post("/login", usuarioController.login);
UsuarioRoutes.post("/create", usuarioController.create);
UsuarioRoutes.get("/read", authentication_1.verificarToken, usuarioController.read);
UsuarioRoutes.put("/update", authentication_1.verificarToken, usuarioController.update);
UsuarioRoutes.put("/setRol", usuarioController.setRol);
UsuarioRoutes.put("/setPersona", usuarioController.setPersona);
UsuarioRoutes.post("/uploadAvatar", usuarioController.uploadAvatar);
exports.default = UsuarioRoutes;
