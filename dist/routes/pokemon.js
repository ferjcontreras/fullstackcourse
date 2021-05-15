"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PokemonRoutes = express_1.Router(); //no new! Router no es clase
PokemonRoutes.get("/getFromAPI", (req, res) => {
    //cargo desde la API todos los pokemon y guardo en nuestra bdd
});
exports.default = PokemonRoutes;
