"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authentication_1 = require("../middlewares/authentication");
const UserRoutes = express_1.Router(); //no new! Router no es clase
UserRoutes.post("/login", (req, res) => {
    const User = {
        email: req.body.email
    };
    //buscar user
    //comparar pass
});
UserRoutes.post("/create", (req, res) => {
    const User = {
        nombre: req.body.nick,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10)
    };
});
UserRoutes.put("/update", authentication_1.verificarToken, (req, res) => {
    let user = {};
    const atributos = ["nick", "email"];
    atributos.forEach(item => {
        if (req.body[item] != null) {
            user[item] = req.body[item];
        }
    });
});
exports.default = UserRoutes;
