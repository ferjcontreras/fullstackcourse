"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const promesas_1 = __importDefault(require("../utils/promesas"));
const EntrenadorRoutes = express_1.Router(); //no new! Router no es clase
EntrenadorRoutes.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Entrenador = {
        nick: req.body.nick,
        password: req.body.password
    };
    try {
        const userPassword = yield promesas_1.default("SELECT password FROM entrenador WHERE nick = ?", [Entrenador.nick]);
        bcrypt_1.default.compare(Entrenador.password, userPassword[0].password, function (err, res2) {
            if (res2) {
                res.json({ estado: "success" });
            }
            else {
                res.json({ estado: "error", message: "La contraseña no coincide" });
            }
        });
    }
    catch (error) {
        const rollback = yield promesas_1.default('rollback'); //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback });
    }
}));
EntrenadorRoutes.post("/verStats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Entrenador = {
        id: req.body.id
    };
    try {
        let userData = yield promesas_1.default("SELECT id,nick,experiencia,nivel FROM entrenador WHERE id = ?", [Entrenador.id]);
        if (userData.length > 0) {
            res.json({ estado: "success", data: userData });
        }
        else {
            res.json({ estado: "error", message: `No se encontró el usuario` });
        }
    }
    catch (error) {
        const rollback = yield promesas_1.default('rollback'); //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback });
    }
}));
EntrenadorRoutes.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newEntrenador = {
        nick: req.body.nick,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10)
    };
    try {
        yield promesas_1.default('start transaction');
        yield promesas_1.default("INSERT INTO entrenador (nick, password, email) VALUES (?,?,?)", [newEntrenador.nick, newEntrenador.password, newEntrenador.email]);
        yield promesas_1.default('commit');
        res.json({ estado: "success" });
    }
    catch (error) {
        const rollback = yield promesas_1.default('rollback'); //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback });
    }
}));
EntrenadorRoutes.put("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Entrenador = {
        id: req.body.id,
        email: req.body.email
    };
    try {
        yield promesas_1.default('start transaction');
        const update = yield promesas_1.default("UPDATE entrenador SET email = ? WHERE id = ?", [Entrenador.email, Entrenador.id]);
        yield promesas_1.default('commit');
        if (update.affectedRows > 0) {
            res.json({ estado: "success", message: `Se han actualizado ${update.affectedRows} registros` });
        }
        else {
            res.json({ estado: "error", message: `No se encontraron usuarios para actualizar` });
        }
    }
    catch (error) {
        const rollback = yield promesas_1.default('rollback'); //puede ir sin await(si no necesito ningun dato del rollback)
        res.json({ estado: "error", data: error, rollback: rollback });
    }
}));
exports.default = EntrenadorRoutes;
