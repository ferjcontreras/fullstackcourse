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
exports.uploadAvatar = exports.setPersona = exports.setRol = exports.update = exports.create = exports.login = void 0;
const token_1 = __importDefault(require("../class/token"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_1 = __importDefault(require("../class/email"));
const promesas_1 = __importDefault(require("../utils/promesas"));
const file_system_1 = __importDefault(require("../class/file-system"));
const fileSystem = new file_system_1.default();
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const Usuario = {
            nick: req.body.nick,
            password: req.body.password
        };
        try {
            const userLoguin = yield promesas_1.default("SELECT id, password, email, idRol, idPersona FROM usuario WHERE nick = ?", [Usuario.nick]);
            bcrypt_1.default.compare(Usuario.password, userLoguin[0].password, function (err, res2) {
                if (res2) {
                    const tokenJwt = token_1.default.getToken({
                        _id: userLoguin[0].id,
                        nick: Usuario.nick,
                        email: userLoguin[0].email,
                        idRol: userLoguin[0].idRol,
                        idPersona: userLoguin[0].idPersona
                    });
                    res.json({ estado: "success", token: tokenJwt });
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
    });
}
exports.login = login;
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUsuario = {
            nick: req.body.nick,
            email: req.body.email,
            password: bcrypt_1.default.hashSync(req.body.password, 10)
        };
        try {
            yield promesas_1.default('start transaction');
            yield promesas_1.default("INSERT INTO usuario (nick, password, email) VALUES (?,?,?)", [newUsuario.nick, newUsuario.password, newUsuario.email]);
            yield promesas_1.default('commit');
            const email = new email_1.default();
            yield email.enviarEmail(req.body.email, 'Creación de Usuario', 'Su usuario ha sido creado correctamente');
            res.json({ estado: "success" });
        }
        catch (error) {
            const rollback = yield promesas_1.default('rollback'); //puede ir sin await(si no necesito ningun dato del rollback)
            res.json({ estado: "error", data: error, rollback: rollback });
        }
    });
}
exports.create = create;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const Usuario = {
            /*id: req.body.id,*/
            email: req.body.email,
            password: bcrypt_1.default.hashSync(req.body.password, 10)
        };
        try {
            yield promesas_1.default('start transaction');
            const update = yield promesas_1.default("UPDATE usuario SET email = ?, password= ? WHERE id = ?", [Usuario.email, Usuario.password, req.usuario._id]);
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
    });
}
exports.update = update;
function setRol(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const Usuario = {
            id: req.body.id,
            idRol: req.body.idRol
        };
        try {
            yield promesas_1.default('start transaction');
            const update = yield promesas_1.default("UPDATE usuario SET idRol = ? WHERE id = ?", [Usuario.idRol, Usuario.id]);
            yield promesas_1.default('commit');
            if (update.affectedRows > 0) {
                res.json({ estado: "success", message: `Se han actualizado ${update.affectedRows} registros` });
            }
            else {
                res.json({ estado: "error", message: `No se pudo setear el Rol` });
            }
        }
        catch (error) {
            const rollback = yield promesas_1.default('rollback'); //puede ir sin await(si no necesito ningun dato del rollback)
            res.json({ estado: "error", data: error, rollback: rollback });
        }
    });
}
exports.setRol = setRol;
function setPersona(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const Usuario = {
            id: req.body.id,
            idPersona: req.body.idPersona
        };
        try {
            yield promesas_1.default('start transaction');
            const update = yield promesas_1.default("UPDATE usuario SET idPersona = ? WHERE id = ?", [Usuario.idPersona, Usuario.id]);
            yield promesas_1.default('commit');
            if (update.affectedRows > 0) {
                res.json({ estado: "success", message: `Se han actualizado ${update.affectedRows} registros` });
            }
            else {
                res.json({ estado: "error", message: `No se pudo setear la Persona` });
            }
        }
        catch (error) {
            const rollback = yield promesas_1.default('rollback'); //puede ir sin await(si no necesito ningun dato del rollback)
            res.json({ estado: "error", data: error, rollback: rollback });
        }
    });
}
exports.setPersona = setPersona;
function uploadAvatar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const avatar = req.files.avatar;
        const Usuario = {
            id: req.body.id
        };
        if (!req.files) {
            return res.status(400).json({
                estado: "error",
                mensaje: "No se encontró ninguna imagen"
            });
        }
        if (!avatar.mimetype.includes("image")) {
            return res.status(400).json({
                estado: "error",
                mensaje: "Formato de imagen incorrecto"
            });
        }
        yield fileSystem.saveImageTemp(Usuario.id, avatar);
        res.json({ estado: "success", message: avatar.name });
    });
}
exports.uploadAvatar = uploadAvatar;
