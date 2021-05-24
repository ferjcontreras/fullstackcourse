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
exports.update = exports.create = void 0;
const promesas_1 = __importDefault(require("../utils/promesas"));
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPersona = {
            tipoDoc: req.body.tipoDoc,
            n_doc: req.body.n_doc,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            fecha_nac: req.body.fecha_nac
        };
        if (req.usuario.rol == 2) { // solo permite agregar el recibo si tiene el rol de contador
            try {
                yield promesas_1.default('start transaction');
                yield promesas_1.default("INSERT INTO persona (tipoDoc, n_doc, nombre, apellido, fecha_nacimiento) VALUES (?,?,?,?,?)", [newPersona.tipoDoc, newPersona.n_doc, newPersona.nombre, newPersona.apellido, newPersona.fecha_nac]);
                yield promesas_1.default('commit');
                res.json({ estado: "success" });
            }
            catch (error) {
                const rollback = yield promesas_1.default('rollback'); //puede ir sin await(si no necesito ningun dato del rollback)
                res.json({ estado: "error", data: error, rollback: rollback });
            }
        }
        else {
            res.json({
                estado: "error",
                mensaje: "usted no tiene privilegios para realizar esta operación"
            });
        }
    });
}
exports.create = create;
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Los usuarios pueden modificar sus datos como Nombre, Apellido, Fecha de Nacimiento, Tipo y Numero de Doc
        const newPersona = {
            tipoDoc: req.body.tipoDoc,
            n_doc: req.body.n_doc,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            fecha_nac: req.body.fecha_nac
        };
        try {
            yield promesas_1.default('start transaction');
            yield promesas_1.default("UPDATE persona SET tipoDoc = ?, n_doc = ?, nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE id = ?", [newPersona.tipoDoc, newPersona.n_doc, newPersona.nombre, newPersona.apellido, newPersona.fecha_nac, req.usuario.idpersona]);
            yield promesas_1.default('commit');
            res.json({ estado: "success" });
        }
        catch (error) {
            const rollback = yield promesas_1.default('rollback'); //puede ir sin await(si no necesito ningun dato del rollback)
            res.json({ estado: "error", data: error, rollback: rollback });
        }
    });
}
exports.update = update;