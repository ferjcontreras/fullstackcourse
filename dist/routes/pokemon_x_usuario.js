"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const Pokemon_x_UsuarioRoutes = express_1.Router(); //no new! Router no es clase
Pokemon_x_UsuarioRoutes.get("/listar", authentication_1.verificarToken, (req, res) => {
    const User = {
        id: req.body.user.id
    };
    //get todos los pokemon de la relacion Pokemon-Usuario con idUser el q viene x get
});
Pokemon_x_UsuarioRoutes.get("/capturar", authentication_1.verificarToken, (req, res) => {
    //un random de nuestra tabla Pokemon
    //insertar en relacion Pokemon-Usuario o sumar 1 si ya lo tenia
});
Pokemon_x_UsuarioRoutes.delete("/transferir", authentication_1.verificarToken, (req, res) => {
    const Pokemon = {
        id: req.body.id
    };
    //-1 en cantidad de la relacion Pokemon-Usuario ; si 0 se elimina la fila
});
exports.default = Pokemon_x_UsuarioRoutes;
